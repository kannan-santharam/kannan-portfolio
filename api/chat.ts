import type { Request, Response } from 'express';
import { Langfuse } from 'langfuse';
import { CANDIDATE_DETAILED_DOSSIER } from '../src/data/candidateDetailedDossier';

// Initialize Langfuse Observability SDK (Server-Side Only)
const langfusePublicKey = (process.env.LANGFUSE_PUBLIC_KEY || process.env.VITE_LANGFUSE_PUBLIC_KEY || '').trim();
const langfuseSecretKey = (process.env.LANGFUSE_SECRET_KEY || process.env.VITE_LANGFUSE_SECRET_KEY || '').trim();
const langfuseBaseUrl = (process.env.LANGFUSE_BASE_URL || process.env.VITE_LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST || process.env.VITE_LANGFUSE_HOST || 'https://us.cloud.langfuse.com').trim();

const langfuse = (langfusePublicKey && langfuseSecretKey)
  ? new Langfuse({
      publicKey: langfusePublicKey,
      secretKey: langfuseSecretKey,
      baseUrl: langfuseBaseUrl
    })
  : null;

interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

// Vercel / Netlify / Node Serverless HTTP Streamable Proxy with Langfuse Monitoring
export default async function handler(req: Request, res: Response) {
  // CORS: only allow requests from the portfolio's own domain
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://kannan-ai-dev.vercel.app',
    'https://kannansantharam.com',
    'https://www.kannansantharam.com',
  ];
  const origin = req.headers.origin || '';
  // Also allow any Vercel preview deployment (kannan-ai-dev-*.vercel.app)
  const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/kannan-ai-dev(-[a-z0-9]+)?\.vercel\.app$/.test(origin);
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, history } = req.body || {};

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Cap query length to prevent prompt injection via long payloads
  if (query.length > 500) {
    return res.status(400).json({ error: 'Query too long' });
  }

  // Server-side secret environment variable (NEVER exposed to browser client, no VITE_ prefix)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured on server' });
  }

  // Start Langfuse Trace & Generation for recruiter query (Production Environment)
  const trace = langfuse?.trace({
    name: 'recruiter-chat-query-production',
    userId: 'recruiter-production-user',
    environment: 'production',
    tags: ['production', 'dubai-recruiter-chat', 'executive-assistant'],
    metadata: {
      env: 'production',
      targetLocation: 'Dubai, UAE',
      targetRole: 'Senior Lead / Engineering Manager',
      host: req.headers.host || 'kannan-ai-dev.vercel.app'
    }
  });

  const generation = trace ? langfuse?.generation({
    traceId: trace.id,
    name: 'gemini-model-cascade-inference',
    model: 'gemini-3-flash-preview',
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

  // Cap history to last 10 turns and validate each turn to prevent prompt injection
  const MAX_HISTORY_TURNS = 10;
  const rawHistory: ConversationTurn[] = Array.isArray(history) ? history : [];
  const conversationHistory = rawHistory
    .slice(-MAX_HISTORY_TURNS)
    .filter(turn => turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.text === 'string')
    .map(turn => ({ role: turn.role, text: turn.text.slice(0, 500) }));

  // Build Gemini contents array with full conversation history
  const contents = [
    // System context as first user turn (Gemini doesn't have a system role, so we prime it)
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I'm ready to represent Kannan Appiya Santharam. Ask me anything about his career, technical expertise, AI projects, or Dubai relocation readiness." }]
    },
    // Inject prior conversation turns for follow-up awareness
    ...conversationHistory.map((turn: ConversationTurn) => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    })),
    // Current user question
    {
      role: 'user',
      parts: [{ text: query }]
    }
  ];

  try {
    const MODELS_TO_TRY = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-3.6-flash'];
    let response: globalThis.Response | null = null;
    let lastError = 'Gemini API Error';

    for (const modelName of MODELS_TO_TRY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${GEMINI_API_KEY}`,
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
          const err = await res.json().catch(() => ({}));
          lastError = (err as any)?.error?.message || `HTTP ${res.status}`;
        }
      } catch (fetchErr: any) {
        lastError = fetchErr?.message || 'Network error';
      }
    }

    if (!response || !response.body) {
      generation?.end({ output: `ERROR: ${lastError}` });
      await langfuse?.flushAsync();
      return res.status(500).json({ error: lastError });
    }

    // Set HTTP Streamable headers (Transfer-Encoding: chunked)
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

    // Record complete generation trace in Langfuse
    generation?.end({ output: accumulatedText });
    res.end();
    langfuse?.flushAsync().catch(() => {});
  } catch (error) {
    generation?.end({ output: 'ERROR: Server proxy failed' });
    langfuse?.flushAsync().catch(() => {});
    return res.status(500).json({ error: 'Server proxy failed to process LLM request' });
  }
}
