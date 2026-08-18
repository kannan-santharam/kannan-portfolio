import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    // Open the official PDF in a new window or trigger direct print
    const printWindow = window.open('/Kannan_Santharam.pdf', '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print-modal-container">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-body)] shadow-2xl overflow-hidden print-resume-box">
        
        {/* Sticky Action Bar (Hidden during print) */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-page)] px-4 py-3 sm:px-6 no-print print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold theme-title">Executive CV · Kannan Appiya Santharam</span>
            <span className="hidden sm:inline-flex rounded-full theme-gold-badge px-2.5 py-0.5 text-[10px] font-bold">
              Dubai Hiring Ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold theme-title transition-all hover:border-[var(--color-primary)] cursor-pointer"
              title="Print CV"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <a
              href="/Kannan_Santharam.pdf"
              download="Kannan-AS.pdf"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:brightness-110 shadow-md cursor-pointer"
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

        {/* Clean, ATS-Standard Printable Resume Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 font-sans text-xs sm:text-sm print-resume-content print:text-[10pt] print:space-y-4 print:p-0">
          
          {/* Resume Header */}
          <div className="border-b border-[var(--border-card)] pb-4 print:border-b-2 print:border-slate-800 print:pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:flex-row print:items-center print:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold theme-title tracking-tight print:text-2xl print:text-slate-900 print:tracking-normal">
                  {RESUME_DATA.name}
                </h1>
                <p className="mt-0.5 text-base sm:text-lg font-bold theme-primary-text print:text-slate-800 print:text-sm print:font-bold">
                  {RESUME_DATA.title}
                </p>
                <p className="text-xs theme-muted print:text-slate-600 print:text-[9.5pt]">
                  Chennai, India · Notice Period: 60 Days · Target Location: Dubai, UAE (Relocation Ready)
                </p>
              </div>

              {/* Clean Contact Info */}
              <div className="space-y-1 text-xs theme-sub font-mono print:text-right print:font-sans print:text-[9pt] print:text-slate-700">
                <div>Phone / BOTIM / WhatsApp: {RESUME_DATA.contact.phone}</div>
                <div>Email: <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-[var(--color-primary)] hover:underline font-semibold">{RESUME_DATA.contact.email}</a></div>
                <div className="pt-0.5 flex flex-wrap items-center gap-2 print:justify-end">
                  <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-1">
                    <span>🔗 LinkedIn</span>
                  </a>
                  <span>·</span>
                  <a href={RESUME_DATA.contact.github} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-1">
                    <span>🐙 GitHub</span>
                  </a>
                  <span>·</span>
                  <a href="https://kannan-ai-dev.vercel.app" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline font-bold flex items-center gap-1">
                    <span>🌐 Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            {/* UI Status Strip (Screen only — hidden during print) */}
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-card)] text-xs no-print print:hidden">
              <span className="theme-gold-badge rounded-full px-3 py-1 font-bold">🇦🇪 {RESUME_DATA.relocation.status}</span>
              <span className="rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1 theme-sub">Notice Period: {RESUME_DATA.relocation.noticePeriod}</span>
              <span className="rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1 theme-sub">Visa Sponsorship Required</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="print:space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider theme-gold-text border-b border-[var(--border-card)] pb-1 print:border-b print:border-slate-400 print:text-slate-900 print:text-[10pt] print:pb-0.5">
              Professional Summary
            </h2>
            <p className="theme-sub leading-relaxed text-xs sm:text-sm mt-1.5 print:text-slate-800 print:text-[9.5pt] print:mt-1 print:leading-normal">
              {RESUME_DATA.summary}
            </p>
          </div>

          {/* Key Achievements & Metrics (Clean list in print, cards on screen) */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider theme-gold-text border-b border-[var(--border-card)] pb-1 print:border-b print:border-slate-400 print:text-slate-900 print:text-[10pt] print:pb-0.5">
              Core Technical Highlights & Metrics
            </h2>
            
            {/* Screen View: Responsive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5 no-print print:hidden">
              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3">
                <div className="text-base font-extrabold theme-gold-text">96% Build Speed Acceleration</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Webpack 5 to Rspack Solo Migration</div>
                <p className="text-[11px] theme-sub mt-1">Reduced cold compilation from 2 minutes to 5 seconds across 12 monorepo packages in 3 weeks.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3">
                <div className="text-base font-extrabold theme-cyan-text">AI Test Platform & Streaming</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Test Authoring & LLM Agents</div>
                <p className="text-[11px] theme-sub mt-1">Architected end-to-end AI test platform from scratch, orchestrating LLM agents to auto generate, execute, and self-heal Playwright test suites via Web Streams.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3">
                <div className="text-base font-extrabold theme-title">Claude Code & MCP Servers</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Custom Skills & Write Guardrails</div>
                <p className="text-[11px] theme-sub mt-1">Authored custom production Claude Code skills and engineered MCP servers, establishing strict write-scope guardrails to secure autonomous agent workflows.</p>
              </div>

              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3">
                <div className="text-base font-extrabold text-emerald-400">30k+ Dead Code Stripped</div>
                <div className="text-xs theme-title font-semibold mt-0.5">Knip Static Analysis</div>
                <p className="text-[11px] theme-sub mt-1">Led codebase hygiene with Knip static analysis, stripping 30,000+ lines of unused dead code and orphaned dependencies across the monorepo.</p>
              </div>
            </div>

            {/* Print View: Traditional Clean Bullet List */}
            <ul className="hidden print:block print:list-disc print:pl-5 print:space-y-1 print:text-[9.5pt] print:text-slate-800 print:mt-1">
              <li><strong>96 Percent Build Speed Acceleration:</strong> Solo executed a 3-week build system migration from Webpack 5 to Rust-powered Rspack across 12 packages at SuperOps, reducing cold start compilation from 2 minutes to 5 seconds and achieving HMR reloads under 50ms.</li>
              <li><strong>AI Test Authoring Platform & Real-Time Streaming:</strong> Architected an automated end-to-end testing platform from scratch using React and Node.js, orchestrating LLM agents to auto generate, execute, and self-heal Playwright test suites with real-time feedback streamed via HTTP Web Streams.</li>
              <li><strong>Production Claude Code Skills & MCP Servers:</strong> Authored custom production Claude Code skills and engineered Model Context Protocol servers, establishing strict multi-tier write-scope guardrails to secure autonomous agent workflows across the codebase.</li>
              <li><strong>Dead Code Elimination:</strong> Led codebase optimization using Knip static analysis, removing 30,000+ lines of unused dead code, unreferenced exports, and orphaned dependencies across 12 monorepo packages.</li>
              <li><strong>Enterprise Test Reliability:</strong> Architected and maintained a comprehensive 232-spec Playwright regression test suite integrated into Jenkins CI/CD pipelines with zero tolerance for flaky tests.</li>
            </ul>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider theme-gold-text border-b border-[var(--border-card)] pb-1 print:border-b print:border-slate-400 print:text-slate-900 print:text-[10pt] print:pb-0.5">
              Work Experience
            </h2>
            <div className="space-y-5 mt-3 print:space-y-3 print:mt-1.5">
              {RESUME_DATA.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[var(--border-gold)] pl-4 space-y-1.5 print:border-l-0 print:pl-0 print:space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 print:flex-row print:justify-between">
                    <h3 className="text-sm sm:text-base font-bold theme-title print:text-[10pt] print:text-slate-900">
                      {exp.company} — <span className="font-semibold">{exp.title}</span>
                    </h3>
                    <span className="text-xs font-mono theme-gold-text print:text-[9pt] print:text-slate-700 print:font-sans">
                      {exp.period} | {exp.location}
                    </span>
                  </div>
                  
                  {exp.progression && (
                    <div className="text-[11px] theme-muted italic print:text-[8.5pt] print:text-slate-600">
                      Role Progression: {exp.progression}
                    </div>
                  )}

                  <ul className="mt-1 space-y-1 text-xs theme-sub print:list-disc print:pl-5 print:space-y-0.5 print:text-[9.5pt] print:text-slate-800">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 print:list-item print:block">
                        <span className="theme-gold-text mt-0.5 no-print print:hidden">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider theme-gold-text border-b border-[var(--border-card)] pb-1 print:border-b print:border-slate-400 print:text-slate-900 print:text-[10pt] print:pb-0.5">
              Technical Skills Matrix
            </h2>
            <div className="space-y-1.5 text-xs theme-sub mt-2 print:space-y-0.5 print:text-[9pt] print:text-slate-800 print:mt-1">
              <div><strong>Frontend Core:</strong> React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, SASS, Responsive Web Design, Core Web Vitals</div>
              <div><strong>AI & Agentic Tech:</strong> Claude Code Skills, Model Context Protocol (MCP) Servers, Cursor IDE, LLM Orchestration, HTTP Streamable (ReadableStream), Agent Guardrails & Write-Scope Design</div>
              <div><strong>State, APIs & Streaming:</strong> GraphQL, Apollo Client, REST APIs, Zustand, Custom Cached Query Hooks, Server-Sent Events (SSE), HTTP Streamable Web Streams</div>
              <div><strong>Architecture & Build:</strong> Monorepos, Rust-powered Rspack, Webpack 5, Micro-Frontends, Knip Static Analysis, Design Systems, Role-Based Access Control (RBAC)</div>
              <div><strong>Testing, DevOps & Cloud:</strong> Playwright End-to-End Suite (232 specs), Node.js, Jenkins CI/CD Pipelines, Docker, AWS (EC2, S3, Route 53), Amazon Bedrock AgentCore</div>
              <div><strong>Leadership & Process:</strong> Engineering Squad Leadership, Developer Mentorship (6 to 7 engineers), Technical Knowledge Sharing, Agile Methodology, Git & GitHub Flow, Architecture & Code Reviews, Cross-Team Collaboration</div>
            </div>
          </div>

          {/* Education */}
          <div className="border-t border-[var(--border-card)] pt-3 print:border-t print:border-slate-400 print:pt-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider theme-gold-text mb-1 print:text-slate-900 print:text-[10pt]">
              Education
            </h2>
            <div className="text-xs theme-title font-bold print:text-[9.5pt] print:text-slate-900">
              {RESUME_DATA.education.degree}
            </div>
            <div className="text-xs theme-sub print:text-[9pt] print:text-slate-700">
              {RESUME_DATA.education.institution} ({RESUME_DATA.education.period}) · {RESUME_DATA.education.location}
            </div>
          </div>

        </div>

        {/* Footer Close Button (Hidden during print) */}
        <div className="border-t border-[var(--border-card)] bg-[var(--bg-page)] p-3 text-center no-print print:hidden">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-2 text-xs font-semibold theme-title hover:border-[var(--color-primary)] cursor-pointer"
          >
            Close Executive Viewer
          </button>
        </div>

      </div>

    </div>
  );
};
