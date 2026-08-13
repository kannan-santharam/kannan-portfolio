import React from 'react';
import { Bot, Cpu, ShieldCheck, Terminal } from 'lucide-react';

export const AiArchitectureShowcase: React.FC = () => {
  return (
    <section id="ai-spotlight" className="py-16 bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/10 px-4 py-1.5 text-xs font-semibold theme-cyan-text">
            <Bot className="h-3.5 w-3.5" />
            <span>AI-Native Engineering Leadership</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold theme-title sm:text-4xl">
            LLM Agents, MCP Skills & Safety Guardrails
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base theme-sub">
            Pioneering agentic development workflows into enterprise monorepos for maximum engineer throughput and safe autonomous code modifications.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Card 1: LLM Agents & Test Platform */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl theme-gold-badge">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold theme-gold-text">LLM Agents</span>
            </div>

            <h3 className="text-xl font-bold theme-title">AI Test-Authoring Platform</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              Architected an automated end-to-end test platform using React and Node.js. Orchestrates autonomous LLM agents to generate, execute, and self-heal test suites.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="flex items-center gap-2 text-emerald-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>// LLM Orchestration</span>
              </div>
              <div className="mt-1 text-slate-400">const agent = new TestAgent();</div>
              <div className="text-amber-300">await agent.generatePlaywrightSpec();</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">LLM Agents</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">React</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Self-Healing</span>
            </div>
          </div>

          {/* Card 2: Custom Claude Code Skills & MCP */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-cyan)]/10 theme-cyan-text">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold theme-cyan-text">MCP Integration</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Claude Code Skills & MCP</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              Authored custom production Claude Code skills powered by Model Context Protocol (MCP) servers, enabling AI agents to reason over complex monorepo ASTs and dependencies.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="theme-cyan-text">&#123; "mcpServers": &#123;</div>
              <div className="pl-3 text-slate-300">"monorepoServer": &#123; "command": "npx", "args": ["@mcp/server"] &#125;</div>
              <div className="theme-cyan-text">&#125; &#125;</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">MCP Servers</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Claude Code</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Cursor IDE</span>
            </div>
          </div>

          {/* Card 3: Write-Scope Guardrails */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-500">Safety System</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Write-Scope Guardrails</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              Designed multi-tier permission boundaries ensuring autonomous AI coding agents only modify target domain modules without mutating core platform interfaces.
            </p>

            <div className="mt-4 rounded-xl border border-[var(--border-card)] bg-[var(--code-bg)] p-3 font-mono text-[11px] text-[var(--code-text)]">
              <div className="text-emerald-400">writeScope: ["src/features/**"]</div>
              <div className="text-rose-400">denyScope: ["src/core/**", "schema.graphql"]</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">AST Sandbox</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Security Control</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Bedrock Core</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
