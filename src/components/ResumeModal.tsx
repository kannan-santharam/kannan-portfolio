import React from 'react';
import { X, Download, Printer, MapPin, Phone, Globe } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-body)] shadow-2xl overflow-hidden">
        
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-page)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold theme-title">Executive CV — Kannan Appiya Santharam</span>
            <span className="hidden sm:inline-flex rounded-full theme-gold-badge px-2.5 py-0.5 text-[10px] font-bold">
              Dubai Hiring Ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)] cursor-pointer"
              title="Print CV"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <a
              href="/Kannan_Santharam.pdf"
              download="Kannan_Appiya_Santharam_Senior_Lead_Software_Engineer.pdf"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#E2B755] to-[#C29633] px-3.5 py-1.5 text-xs font-bold text-[#07090E] transition-all hover:brightness-110 shadow-md cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 theme-sub hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 font-sans text-xs sm:text-sm">
          
          {/* Header */}
          <div className="border-b border-[var(--border-card)] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold theme-title tracking-tight">
                  {RESUME_DATA.name}
                </h1>
                <p className="mt-1 text-base sm:text-lg font-bold theme-gold-text">
                  {RESUME_DATA.title}
                </p>
                <p className="mt-0.5 text-xs theme-sub font-mono">
                  {RESUME_DATA.subTitle}
                </p>
              </div>

              <div className="space-y-1 text-xs theme-sub font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 theme-gold-text" />
                  <span>{RESUME_DATA.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 theme-cyan-text" />
                  <span>{RESUME_DATA.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-purple-400" />
                  <span>{RESUME_DATA.contact.linkedinDisplay}</span>
                </div>
              </div>
            </div>

            {/* Status Strip */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-card)] text-xs">
              <span className="theme-gold-badge rounded-full px-3 py-1 font-bold">🇦🇪 {RESUME_DATA.relocation.status}</span>
              <span className="rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1 theme-sub">Notice Period: {RESUME_DATA.relocation.noticePeriod}</span>
              <span className="rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1 theme-sub">Visa Sponsorship Required</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider theme-gold-text mb-2">Professional Summary</h2>
            <p className="theme-sub leading-relaxed text-xs sm:text-sm">
              {RESUME_DATA.summary}
            </p>
          </div>

          {/* Key Achievements */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider theme-gold-text mb-3">Key Highlights & Engineering Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3.5">
                <div className="text-lg font-extrabold theme-gold-text">96% Build Speedup</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Webpack 5 to Rspack Solo Migration</div>
                <p className="text-[11px] theme-sub mt-1">Reduced cold compilation from 2 minutes to 5 seconds across 12 monorepo packages in 3 weeks.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3.5">
                <div className="text-lg font-extrabold theme-cyan-text">AI Test Platform</div>
                <div className="text-xs theme-title font-semibold mt-0.5">LLM Agents & Self-Healing Tests</div>
                <p className="text-[11px] theme-sub mt-1">Built an AI test-authoring platform from zero, using LLM agents to auto-generate, execute, and self-heal test suites.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3.5">
                <div className="text-lg font-extrabold theme-title">Claude Code & MCP</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Custom Skills & Write Guardrails</div>
                <p className="text-[11px] theme-sub mt-1">Authored custom production Claude Code skills using MCP servers, with strict write-scope guardrails securing autonomous agent workflows.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3.5">
                <div className="text-lg font-extrabold text-emerald-400">30k Dead Code Stripped</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Playwright Suite & Knip Analysis</div>
                <p className="text-[11px] theme-sub mt-1">Maintained 232-spec Playwright regression suite and stripped 30,000 lines of dead code using Knip analysis.</p>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider theme-gold-text mb-4">Work Experience</h2>
            <div className="space-y-6">
              {RESUME_DATA.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[var(--border-gold)] pl-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h3 className="text-base font-bold theme-title">{exp.title}</h3>
                    <span className="text-xs font-mono theme-gold-text">{exp.period}</span>
                  </div>
                  <div className="text-xs font-semibold theme-cyan-text">{exp.company} • {exp.location}</div>
                  
                  {exp.progression && (
                    <div className="text-[11px] theme-muted italic">Progression: {exp.progression}</div>
                  )}

                  <ul className="mt-2 space-y-1.5 text-xs theme-sub">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="theme-gold-text mt-1">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider theme-gold-text mb-3">Technical Skills Matrix</h2>
            <div className="space-y-2 text-xs theme-sub">
              <div><strong>AI & Agentic Tooling:</strong> Claude Code, Model Context Protocol (MCP) Servers, Cursor IDE, LLM Orchestration, Agent Guardrails & Write-Scope Design</div>
              <div><strong>Software Core:</strong> React 19, React Compiler, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS</div>
              <div><strong>State & Data:</strong> GraphQL, Apollo Client, REST APIs, Zustand, Custom Cached Query Hooks</div>
              <div><strong>Architecture & Performance:</strong> Monorepos, Rspack, Webpack 5, Vite, pnpm, Micro-Frontends, Knip Static Analysis</div>
              <div><strong>Testing & Quality:</strong> Playwright End-to-End Suite, Node.js, Jenkins CI/CD</div>
            </div>
          </div>

          {/* Education */}
          <div className="border-t border-[var(--border-card)] pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider theme-gold-text mb-1">Education</h2>
            <div className="text-xs theme-title font-bold">{RESUME_DATA.education.degree}</div>
            <div className="text-xs theme-sub">{RESUME_DATA.education.institution} ({RESUME_DATA.education.period})</div>
          </div>

        </div>

        {/* Footer Close Button */}
        <div className="border-t border-[var(--border-card)] bg-[var(--bg-page)] p-3 text-center">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-2 text-xs font-semibold theme-title hover:border-[var(--color-gold)] cursor-pointer"
          >
            Close Executive Viewer
          </button>
        </div>

      </div>

    </div>
  );
};
