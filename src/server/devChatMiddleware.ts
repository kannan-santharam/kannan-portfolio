import type { Plugin } from 'vite';
import { Langfuse } from 'langfuse';
import { CANDIDATE_DETAILED_DOSSIER } from '../data/candidateDetailedDossier.ts';

/**
 * Local Dev Server Middleware for /api/chat with Langfuse Monitoring
 * Runs strictly during local development (`pnpm dev`) so the AI chatbot works seamlessly
 * without requiring the Vercel CLI. In production on Vercel, `api/chat.ts` handles this.
 */
export function apiChatDevPlugin(env: Record<string, string>): Plugin {
  const apiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  const publicKey = (env.LANGFUSE_PUBLIC_KEY || env.VITE_LANGFUSE_PUBLIC_KEY || process.env.LANGFUSE_PUBLIC_KEY || process.env.VITE_LANGFUSE_PUBLIC_KEY || '').trim();
  const secretKey = (env.LANGFUSE_SECRET_KEY || env.VITE_LANGFUSE_SECRET_KEY || process.env.LANGFUSE_SECRET_KEY || process.env.VITE_LANGFUSE_SECRET_KEY || '').trim();
  const baseUrl = (env.LANGFUSE_BASE_URL || env.VITE_LANGFUSE_BASE_URL || env.LANGFUSE_HOST || env.VITE_LANGFUSE_HOST || process.env.LANGFUSE_BASE_URL || process.env.VITE_LANGFUSE_BASE_URL || 'https://us.cloud.langfuse.com').trim();

  const langfuse = (publicKey && secretKey)
    ? new Langfuse({ publicKey, secretKey, baseUrl })
    : null;

  if (langfuse) {
    console.log(`[Langfuse Dev Proxy Initialized] 🚀 Connected to Host: ${baseUrl} | Public Key: ${publicKey.slice(0, 10)}...`);
  } else {
    console.log(`[Langfuse Dev Proxy Warning] ⚠️ Langfuse keys not detected in dev environment.`);
  }

  return {
    name: 'api-chat-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { query, history } = JSON.parse(bodyStr || '{}');
            if (!query || typeof query !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Query parameter is required' }));
              return;
            }

            // Cap query length to prevent prompt injection via long payloads
            if (query.length > 500) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Query too long' }));
              return;
            }

            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found in environment' }));
              return;
            }

            // Start Langfuse Trace & Generation for recruiter query
            const trace = langfuse?.trace({
              name: 'recruiter-chat-query-dev',
              userId: 'recruiter-dev-local',
              metadata: { env: 'development', targetLocation: 'Dubai, UAE' }
            });

            const generation = trace ? langfuse?.generation({
              traceId: trace.id,
              name: 'gemini-flash-latest-dev-inference',
              model: 'gemini-flash-latest',
              input: query
            }) : null;

            const SYSTEM_PROMPT = `You are Kannan Appiya Santharam's personal AI Career Assistant — smart, articulate, and personable. You speak naturally and conversationally on behalf of Kannan, helping technical recruiters, engineering managers, and hiring decision-makers understand why Kannan is an exceptional candidate for Senior Lead / Engineering Manager roles in Dubai, UAE.

PERSONA & TONE:
- Speak in a warm, confident, third-person executive voice ("Kannan built...", "He led...", "His approach to...").
- Be genuinely helpful — answer what was asked specifically, don't dump unrelated information.
- For follow-up questions, naturally reference what was said earlier in the conversation to create coherence.
- Use light formatting: bold for key terms, bullet points only when listing multiple items.
- Be concise but complete. No fluff, no filler sentences.
- If asked something off-topic (weather, sports, politics, etc.), politely decline and steer back to Kannan's profile.

KNOWLEDGE BASE — USE THIS AS YOUR AUTHORITATIVE SOURCE:
${CANDIDATE_DETAILED_DOSSIER}

ANSWERING RULES:
- Always derive your answers from the knowledge base above. Do not fabricate or guess.
- For experience questions, highlight specific achievements, metrics, and impact — not just responsibilities.
- For technical questions, explain the WHY and the OUTCOME, not just the technology used.
- For follow-ups like "tell me more", "can you expand", "what else", look at the previous context and go deeper on the same topic.
- Keep answers under 250 words unless the user explicitly asks for a full breakdown.
`;

            // Cap history to last 10 turns (5 exchanges) to prevent token overflow
            const MAX_HISTORY_TURNS = 10;
            const rawHistory = Array.isArray(history) ? history : [];
            const conversationHistory = rawHistory.slice(-MAX_HISTORY_TURNS);

            const contents = [
              // Prime Gemini with system persona as first turn
              {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
              },
              {
                role: 'model',
                parts: [{ text: "Understood. I'm ready to represent Kannan Appiya Santharam. Ask me anything about his career, technical expertise, AI projects, or Dubai relocation readiness." }]
              },
              // Inject prior conversation turns for follow-up context
              ...conversationHistory.map((turn: { role: string; text: string }) => ({
                role: turn.role,
                parts: [{ text: turn.text }]
              })),
              // Current user question
              {
                role: 'user',
                parts: [{ text: query }]
              }
            ];

            // Cascade across active models with fallback to prevent 429/503 quota exhaustion
            const MODELS_TO_TRY = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-3.6-flash'];
            let response: globalThis.Response | null = null;
            let lastError = 'Gemini API Error';

            for (const modelName of MODELS_TO_TRY) {
              try {
                const res = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${apiKey}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents,
                      generationConfig: {
                        temperature: 0.35,
                        topP: 0.85,
                        topK: 40,
                        maxOutputTokens: 1500
                      }
                    })
                  }
                );

                if (res.ok && res.body) {
                  response = res;
                  break;
                } else {
                  const errData = await res.json().catch(() => ({}));
                  lastError = (errData as any)?.error?.message || `HTTP ${res.status}`;
                  console.warn(`[Gemini Model ${modelName}] ⚠️ ${lastError} — attempting fallback...`);
                }
              } catch (fetchErr: any) {
                lastError = fetchErr?.message || 'Network error';
              }
            }

            if (!response || !response.body) {
              console.error(`[Gemini Proxy Error] ❌ All models exhausted: ${lastError}`);
              generation?.end({ output: `ERROR: ${lastError}` });
              await langfuse?.flushAsync();
              res.statusCode = 500;
              res.end(JSON.stringify({ error: lastError }));
              return;
            }

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let rawBuffer = '';
            let accumulatedText = '';

            // Robust brace-depth JSON extractor — handles chunk boundaries correctly
            function extractJsonObjects(buf: string): { objects: any[]; remaining: string } {
              const objects: any[] = [];
              let i = buf.indexOf('{');
              while (i !== -1) {
                let depth = 0, inStr = false, esc = false, end = -1;
                for (let j = i; j < buf.length; j++) {
                  const ch = buf[j];
                  if (esc) { esc = false; continue; }
                  if (ch === '\\' && inStr) { esc = true; continue; }
                  if (ch === '"') { inStr = !inStr; continue; }
                  if (inStr) continue;
                  if (ch === '{') depth++;
                  else if (ch === '}' && --depth === 0) { end = j; break; }
                }
                if (end === -1) break; // Incomplete — wait for more data
                try { objects.push(JSON.parse(buf.slice(i, end + 1))); } catch { /* skip bad JSON */ }
                buf = buf.slice(end + 1);
                i = buf.indexOf('{');
              }
              return { objects, remaining: buf };
            }

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              rawBuffer += decoder.decode(value, { stream: true });
              const { objects, remaining } = extractJsonObjects(rawBuffer);
              rawBuffer = remaining;
              for (const obj of objects) {
                // Only read content text — ignore thoughtSignature, metadata, empty strings
                const text: string = obj?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (text) {
                  accumulatedText += text;
                  res.write(text);
                }
              }
            }

            generation?.end({ output: accumulatedText });
            res.end();
            langfuse?.flushAsync().catch(() => {});
            console.log(`[Langfuse Trace Flushed] 🚀 Query: "${query.slice(0, 40)}..." -> Sent trace ${trace?.id}`);
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Server proxy failed' }));
          }
        });
      });
    }
  };
}
