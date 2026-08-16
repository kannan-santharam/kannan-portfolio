import type { Request, Response } from 'express';
import { Langfuse } from 'langfuse';

// Master candidate dossier embedded directly for Vercel serverless runtime isolation
const CANDIDATE_DETAILED_DOSSIER = `
# KANNAN APPIYA SANTHARAM — MASTER EXECUTIVE PROFILE & CODEBASE DOSSIER

## 1. EXECUTIVE OVERVIEW & DEMOGRAPHICS
- Full Candidate Name: Kannan Appiya Santharam
- Current Title: Senior Lead Software Engineer (10.5+ Years Experience)
- Target Roles: Lead Software Engineer / Engineering Manager
- Target Location: Dubai, UAE (Ready to relocate immediately upon 60 days notice)
- Notice Period: 60 Days
- Visa Status: UAE Employment Visa Sponsorship Required
- Citizenship: Indian Citizen (Valid Passport)
- Languages: English (Fluent / Professional), Tamil (Native), Hindi (Basic)
- Email: as.kannan4@gmail.com
- Phone / WhatsApp / BOTIM App: +91 97902 47499
- LinkedIn: linkedin.com/in/askannan (https://linkedin.com/in/askannan)
- GitHub: github.com/kannan-santharam (https://github.com/kannan-santharam)
- Executive Summary: Senior Lead Software Engineer with 10.5+ years of experience delivering high-performance web applications, monorepos, and scalable client architectures for global SaaS products. Specialised in AI-driven development, agentic workflows, LLM orchestration, custom Claude Code skills, MCP servers, and HTTP Streamable architectures. Proven record of leading solo platform migrations, cutting build compilation time by 96%, and setting engineering standards across distributed engineering teams.

## 2. CAREER HIGHLIGHTS & KEY ENGINEERING METRICS
- **96% Build Speed Acceleration (Rspack Migration)**: Solo-led a 3-week build migration from Webpack 5 to Rust-powered Rspack across 12 packages at SuperOps. Reduced cold-start compilation from 2 minutes (120s) down to 5 seconds, with HMR hot reloads under 50ms. Saved hundreds of developer hours monthly across distributed teams and accelerated Jenkins CI/CD pipelines.
- **AI Test-Authoring Platform & Real-Time Streaming**: Architected an automated end-to-end test platform from scratch using React and Node.js streaming autonomous LLM agent tool calls over HTTP Streamable Web Streams (fetch + ReadableStream). Auto-generates, executes, and self-heals Playwright test specs.
- **Production Claude Code Skills & MCP Servers**: Authored custom production Claude Code skills powered by Model Context Protocol (MCP) servers. Enforced strict write-scope guardrails allowing AI agents to edit feature modules while strictly protecting core system schemas.
- **Dead Code Elimination (30k+ Lines with Knip)**: Led codebase optimization using Knip static analysis, identifying and eliminating 30,000+ lines of unused dead code, unreferenced exports, and orphaned dependencies across 12 monorepo packages.
- **Enterprise Test Reliability (Playwright E2E Suite)**: Architected and maintained a comprehensive 232-spec Playwright regression test suite integrated into Jenkins CI/CD pipelines with zero tolerance for flaky tests.

## 3. WORK HISTORY & EXPERIENCE DEEP DIVE

### SuperOps — Senior Lead Software Engineer (Jul 2022 – Present)
- **Role Progression**: Senior Software Engineer → Lead Software Engineer → Senior Lead Software Engineer
- **Location**: Chennai, India
- **Key Engineering Achievements**:
  • Architected an AI test-authoring platform from zero using React and Node.js, orchestrating LLM agents over HTTP Streamable Web Streams (fetch + ReadableStream) to auto-generate, run, and self-heal end-to-end test suites.
  • Authored custom production Claude Code skills via MCP servers and enforced strict write-scope guardrails, securing autonomous agent workflows across the codebase.
  • Executed a solo Webpack 5 to Rspack migration in 3 weeks, reducing cold-start build compilation from 2 minutes to 5 seconds across 12 packages.
  • Improved application load times through React lazy loading, route-level code splitting and per-package chunking strategy across the monorepo.
  • Eliminated 30,000+ lines of dead code and unused dependencies across the monorepo using Knip static analysis.
  • Maintained platform quality and release stability with a 232-spec Playwright regression suite in Jenkins CI.
  • Sole-authored a reusable API / UI SDK integration framework adopted across product teams, standardising how features consume platform services.
  • Built role-based access control (RBAC) gates and high-frequency polling dashboards using custom cached Apollo query hooks, balancing data freshness against network load.

### Freshworks — Senior Software Engineer (Jun 2018 – Jul 2022)
- **Role Progression**: Onboarding Engineer → Senior Software Engineer (Customer-Facing Engineering)
- **Location**: Chennai, India
- **Key Engineering Achievements**:
  • Worked directly with enterprise customers alongside Support, Customer Success, and Sales teams to understand complex requirements, partnering with Product Design to deliver UI solutions.
  • Built UI web pages and REST API services across Freshworks products using React, JavaScript, Node.js, HTML, and SASS.
  • Built a Customer 360 dashboard consolidating all customer support, sales, and account information into a single unified operational view.
  • Integrated tier-1 enterprise SaaS platforms — Jira, Salesforce, Zendesk, and ServiceNow — with Freshworks products through robust REST API services.
  • Awarded the prestigious Customer Champion Award for delivering critical customer UI features ahead of schedule.
  • Created UI wireframes and design mockups in Balsamiq; mentored junior engineers on add-on development and led code & UI design reviews.

### Infigenic — Software Developer (Jan 2018 – Jun 2018)
- **Location**: Bengaluru, India
- **Key Engineering Achievements**:
  • Designed and implemented high-converting company web pages and product landing pages.
  • Built a seamless integration connecting Freshservice with DocuSign using REST API services; the product was subsequently acquired by Freshworks.

### Niche Video Media — Web Application Developer (Mar 2016 – Dec 2017)
- **Location**: Chennai, India
- **Key Engineering Achievements**:
  • Designed and implemented responsive web pages, landing pages, and custom plugins for a commercial video-hosting platform.
  • Built a video player customisation feature from scratch — configurable player buttons, annotations, and call-to-action overlays.
  • Implemented an administrative dashboard that dynamically generated Stripe pricing plans based on feature selection, storage tiers, and bandwidth tiers.

## 4. TECHNICAL SKILLS MATRIX
- **Software Core & Web**: React, React Compiler, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, SASS.
- **AI & Agentic Tooling**: Claude Code Skills, Model Context Protocol (MCP) Servers, Cursor IDE, LLM Orchestration, Write-Scope Safety, Amazon Bedrock AgentCore.
- **State, Data & APIs**: GraphQL, Apollo Client, REST APIs, Zustand, Custom Cached Query Hooks, HTTP Streamable Web Streams.
- **Architecture & Performance**: Monorepos, Rust-powered Rspack, Webpack 5, Vite, pnpm, Micro-Frontends, Knip Static Analysis, Design Systems & UI SDKs.
- **Testing, DevOps & Cloud**: Playwright E2E Suite (232 specs), Node.js Services, Jenkins CI/CD Pipelines, AWS (EC2, S3, Route 53).
- **Soft Skills & Leadership**: Technical Team Leadership, Developer Mentorship & Code Reviews, Conducting AI & Tech Knowledge-Sharing Sessions, Strategic Tech Governance, Cross-Functional Collaboration.

## 5. STRATEGIC TECH GOVERNANCE & ENGINEERING LEADERSHIP
- **Architectural Guardrails & Monorepo Governance**: Defined strict monorepo write-scope boundaries, component contract standards, and reusable SDK specifications across 12 packages at SuperOps.
- **Tooling Selection & Build Migration Governance**: Evaluated and governed core build tools, leading the 3-week monorepo migration from Webpack 5 to Rspack resulting in 96% build acceleration (2 minutes down to 5 seconds).
- **AI Agent Permission & Safety Governance**: Authored custom Claude Code skills powered by Model Context Protocol (MCP) servers, establishing multi-tier Write-Scope Guardrails to allow AI agents to edit feature modules while protecting core system schemas.
- **CI/CD Quality Gates & Automated Testing**: Enforced a 232-spec Playwright regression test suite integrated into Jenkins CI pipelines with zero tolerance for flaky tests.
- **Codebase Health & Dead Code Governance**: Led systematic dead-code elimination and dependency hygiene using Knip static analysis, stripping 30,000+ lines of unmaintained code.

## 6. PORTFOLIO CODEBASE ARCHITECTURE & TECH STACK
- **Frontend Stack**: Built with React, TypeScript, Vite v8, and Tailwind CSS. Fully responsive design with theme-aware tokens (Dark/Light mode support).
- **AI Chatbot & Stream Architecture**: Uses real-time HTTP Streamable Web Streams ('fetch' + 'ReadableStream') connected to Google Gemini LLM via a Vercel Edge Serverless Function (/api/chat) with server-hidden API keys.
- **Universal Vector RAG Engine**: Features an offline-capable Universal Subword Vector RAG Engine using word tokens + subword character 3-gram/4-gram embeddings and Cosine Similarity to retrieve candidate context with 100% precision.
- **LLM Observability**: Integrated with Langfuse Cloud (us.cloud.langfuse.com) for tracking trace IDs, recruiter query sessions, and token latency.
- **Technical Handover PDF**: Automatically generated executive handover document (Kannan_Santharam_Portfolio_Technical_Architecture_Handover.pdf) built via a custom Python ReportLab script.

## 7. EDUCATION & PERSONAL DEMOGRAPHICS
- **Higher Education**: Bachelor of Engineering (B.E.) in Computer Science from K.L.N. College of Information Technology under Anna University (2011 – 2015).
- **Schooling**: High school education in Madurai, Tamil Nadu (studied Maths, Physics, Chemistry, and Computer Science).
- **Demographics & Personal**: Born in Madurai, Tamil Nadu; Indian Citizen with a valid passport. Native Tamil speaker, fluent in English.

## 8. DUBAI RELOCATION, VISA & SALARY
- **Target Role**: Lead Software Engineer / Engineering Manager in Dubai, UAE.
- **Relocation Availability**: Available immediately upon 60 days notice period.
- **Visa Requirement**: UAE Employment Visa Sponsorship Required.
- **Family Settlement**: Plans to relocate family to Dubai post-onboarding and settle permanently.
- **Communication Channels**: Direct messaging and VoIP calls on BOTIM App and WhatsApp at +91 97902 47499.
- **Salary & Compensation**: Prefers to discuss AED market compensation directly over an introductory recruiter screening call to align with role scope and total rewards package.
`;

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
