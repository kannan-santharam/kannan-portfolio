import React from 'react';
import { Bot, Component, Cpu, ShieldCheck } from 'lucide-react';

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
            LLM Agents, MCP Servers, Design-to-Code & Guardrails
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base theme-sub">
            Pioneering agentic development workflows at enterprise scale, from design-to-code component generation through to safe autonomous code modifications, for maximum engineer throughput.
          </p>
        </div>

        {/* 4 Pillar Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
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

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">LLM Agents</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">React</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Node.js</span>
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

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">AST Sandbox</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Security Control</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Bedrock Core</span>
            </div>
          </div>

          {/* Card 4: Design System & Figma-to-Component Skill */}
          <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xl transition-all hover:border-[var(--border-gold)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <Component className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs font-bold text-violet-500">Design-to-Code</span>
            </div>

            <h3 className="text-xl font-bold theme-title">Base UI Design System & Figma Skill</h3>
            <p className="mt-2 text-xs theme-sub leading-relaxed">
              Built a headless design system from scratch on Base UI with customised design tokens, then authored a Claude Code skill that pulls design context from a Figma node link through an MCP server and generates the production component, taking page build-out from 2 days of AI-assisted engineering to a few hours.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Base UI</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Figma MCP</span>
              <span className="rounded bg-[var(--bg-inner)] border border-[var(--border-card)] px-2 py-0.5 text-[10px] font-medium theme-sub">Design System</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
