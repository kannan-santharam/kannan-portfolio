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

// Vercel / Netlify / Node Serverless HTTP Streamable Proxy with Langfuse Monitoring
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body || {};

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Server-side secret environment variable (NEVER exposed to browser client)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured on server' });
  }

  // Start Langfuse Trace & Generation for recruiter query
  const trace = langfuse?.trace({
    name: 'recruiter-chat-query',
    userId: 'recruiter-anonymous',
    metadata: { env: process.env.NODE_ENV || 'production', targetLocation: 'Dubai, UAE' }
  });

  const generation = trace ? langfuse?.generation({
    traceId: trace.id,
    name: 'gemini-1.5-flash-inference',
    model: 'gemini-1.5-flash',
    input: query
  }) : null;

  const SYSTEM_PROMPT = `
  You are Kannan Appiya Santharam's official AI Executive Candidate Assistant.
  Your primary role is to answer questions from technical recruiters, engineering managers, and executive interviewers evaluating Kannan for Senior Lead / Engineering Manager positions in Dubai, UAE.

  DYNAMIC KNOWLEDGE INSTRUCTION:
  - Analyze, transform, rephrase, and summarize information directly from the provided CANDIDATE DETAILED DOSSIER into articulate third-person executive phrasing ("Kannan is...", "He holds...", "He completed...").
  - Provide concise, topic-focused answers directly targeting the user's specific question instead of dumping entire section blocks.
  - If asked any off-topic question, POLITELY DECLINE.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
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
      const err = await response.json().catch(() => ({}));
      generation?.end({ output: `ERROR: ${err?.error?.message || 'Gemini API Proxy Error'}` });
      await langfuse?.flushAsync();
      return res.status(response.status).json({ error: err?.error?.message || 'Gemini API Proxy Error' });
    }

    // Set HTTP Streamable headers (Transfer-Encoding: chunked)
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

    // Record complete generation trace in Langfuse
    generation?.end({ output: accumulatedText });
    await langfuse?.flushAsync();

    res.end();
  } catch (error) {
    generation?.end({ output: 'ERROR: Server proxy failed' });
    await langfuse?.flushAsync();
    return res.status(500).json({ error: 'Server proxy failed to process LLM request' });
  }
}
