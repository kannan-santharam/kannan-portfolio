import React from 'react';
import { FileSearch, ExternalLink, Database, Workflow, Radio } from 'lucide-react';

const DOCMIND_LIVE_URL = 'https://docmind-rag-llm.vercel.app';
const DOCMIND_REPO_URL = 'https://github.com/kannan-santharam/DocMind';

export const DocMindShowcase: React.FC = () => {
  return (
    <section id="ai-project" className="py-16 bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/10 px-4 py-1.5 text-xs font-semibold theme-cyan-text">
            <FileSearch className="h-3.5 w-3.5" />
            <span>Featured AI Project</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold theme-title sm:text-4xl">
            DocMind — Agentic RAG Chatbot
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base theme-sub">
            Upload a PDF, DOCX, Markdown, or pasted text and ask questions — a tool-calling Gemini agent decides when to retrieve, rewrites thin queries, and grounds every answer with citations back to the exact passage.
          </p>
        </div>

        {/* Intro Card: Stack + Links */}
        <div className="mb-8 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold theme-title">Built, deployed, and answering questions right now</h3>
              <p className="mt-2 max-w-2xl text-xs theme-sub leading-relaxed">
                Preloaded with Kannan's professional profile, so recruiters can interrogate his experience the moment the page opens — or upload their own job description and ask against it. It can even explain how it was itself engineered.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Next.js 16</span>
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">TypeScript</span>
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Gemini Function Calling</span>
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Supabase pgvector (HNSW, cosine)</span>
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Langfuse</span>
                <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Vercel</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a
                href={DOCMIND_LIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-[#0052FF]/30 cursor-pointer text-center active:scale-95 shadow-md"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>Live demo</span>
              </a>
              <a
                href={DOCMIND_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-5 py-3 text-xs sm:text-sm font-semibold theme-title transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer text-center active:scale-95"
              >
                <svg className="h-4 w-4 shrink-0 fill-current theme-cyan-text" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>Source</span>
              </a>
            </div>
          </div>
        </div>

        {/* Engineering Deep-Dive Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Card 1: Embeddings vs Index Limits */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl theme-gold-badge">
                <Database className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold theme-gold-text">Vector Search</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Embeddings vs Index Limits</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              pgvector's HNSW index rejects anything above 2000 dimensions, so the model's native 3072-dim embeddings are truncated to 768 and re-normalised before indexing.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="text-slate-400">// 3072 native → HNSW cap is 2000</div>
              <div className="text-amber-300">vec = normalize(vec.slice(0, 768))</div>
              <div className="text-emerald-400">USING hnsw (embedding vector_cosine_ops)</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">pgvector</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">HNSW</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">768-dim</span>
            </div>
          </div>

          {/* Card 2: Measured Quotas & Fallback Chain */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-cyan)]/10 theme-cyan-text">
                <Workflow className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold theme-cyan-text">Resilience</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Resilient Model Cascading</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              API rate limits were measured against the live service, not assumed — informing a five-model Gemini fallback chain that cascades automatically on quota errors so answers keep flowing without user-facing failures.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="text-rose-400">429 RESOURCE_EXHAUSTED → cascade</div>
              <div className="text-emerald-400">fallbackChain: [5 Gemini models]</div>
              <div className="text-slate-400">// zero user-facing errors</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Model Cascading</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Rate-Limit Aware</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">High Availability</span>
            </div>
          </div>

          {/* Card 3: SSE Framing Bug */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Radio className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-500">Streaming</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Live Agent Decision Trail</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              The agent streams its reasoning to the UI in real time over Server-Sent Events — whether it chose to retrieve, how it rewrote a thin query, and the answer token-by-token, backed by a hardened stream parser.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="theme-cyan-text">event: decision → "retrieval needed"</div>
              <div className="text-amber-300">event: rewrite → "sharpen query"</div>
              <div className="text-emerald-400">event: answer → tokens + citations</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">SSE</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Streaming UX</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Agent Transparency</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
