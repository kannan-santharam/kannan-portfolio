import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';
import { Langfuse } from 'langfuse';
import { CANDIDATE_DETAILED_DOSSIER } from './src/data/candidateDetailedDossier.ts';

// Local Dev Server Middleware for /api/chat with Langfuse Monitoring
function apiChatPlugin(env: Record<string, string>): Plugin {
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
            const { query } = JSON.parse(bodyStr || '{}');
            if (!query) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Query parameter is required' }));
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
              name: 'gemini-1.5-flash-dev-inference',
              model: 'gemini-1.5-flash',
              input: query
            }) : null;

            const SYSTEM_PROMPT = `
            You are Kannan Appiya Santharam's official AI Executive Candidate Assistant.
            Your primary role is to answer questions from technical recruiters, engineering managers, and executive interviewers evaluating Kannan for Senior Lead / Engineering Manager positions in Dubai, UAE.

            DYNAMIC KNOWLEDGE INSTRUCTION:
            - Analyze, transform, rephrase, and summarize information directly from the provided CANDIDATE DETAILED DOSSIER into articulate third-person executive phrasing ("Kannan is...", "He holds...", "He completed...").
            - Provide concise, topic-focused answers directly targeting the user's specific question.
            - If asked any off-topic question, POLITELY DECLINE.
            `;

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        {
                          text: `${SYSTEM_PROMPT}\n\nCANDIDATE DETAILED DOSSIER:\n${CANDIDATE_DETAILED_DOSSIER}\n\nUSER QUESTION: ${query}`
                        }
                      ]
                    }
                  ],
                  generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 800
                  }
                })
              }
            );

            if (!response.ok || !response.body) {
              const errData = await response.json().catch(() => ({}));
              generation?.end({ output: `ERROR: ${(errData as any)?.error?.message || 'Gemini API Proxy Error'}` });
              await langfuse?.flushAsync();
              res.statusCode = response.status;
              res.end(JSON.stringify({ error: (errData as any)?.error?.message || 'Gemini API Proxy Error' }));
              return;
            }

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let accumulatedText = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              try {
                const matches = chunk.match(/"text":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g);
                if (matches) {
                  for (const match of matches) {
                    const rawText = match.replace(/"text":\s*"/, '').slice(0, -1);
                    const unescaped = rawText.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                    if (unescaped && !accumulatedText.endsWith(unescaped)) {
                      accumulatedText += unescaped;
                      res.write(unescaped);
                    }
                  }
                }
              } catch {
                // Ignore partial JSON chunk parse error
              }
            }

            generation?.end({ output: accumulatedText });
            await langfuse?.flushAsync();
            console.log(`[Langfuse Trace Flushed] 🚀 Query: "${query.slice(0, 30)}..." -> Sent trace ${trace?.id} to ${baseUrl}`);
            res.end();
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Server proxy failed' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      apiChatPlugin(env),
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ]
  };
});
