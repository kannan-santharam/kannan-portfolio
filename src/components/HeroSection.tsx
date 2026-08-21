import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  MessageSquare,
  ShieldCheck,
  Zap,
  Bot,
  Download,
  PhoneForwarded,
  Copy,
  Check
} from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';
import { useRegion } from '../context/RegionContext';

interface HeroSectionProps {
  onOpenResumeModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResumeModal }) => {
  const [copiedBotim, setCopiedBotim] = useState(false);
  const { content } = useRegion();

  const handleCopyBotim = () => {
    navigator.clipboard.writeText(RESUME_DATA.contact.phone);
    setCopiedBotim(true);
    setTimeout(() => setCopiedBotim(false), 2000);
  };

  return (
    <section id="hero" className="relative overflow-hidden pb-12 pt-8 sm:pb-20 sm:pt-16 lg:pb-24">
      {/* Background Radial Glow with Palette 1 Electric Cobalt & Cyan */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#0052FF]/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-40 right-10 h-80 w-80 rounded-full bg-[#00D2FF]/15 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          
          {/* Mobile Profile Photo */}
          <div className="lg:hidden lg:col-span-5">
            <div className="relative mx-auto max-w-xs sm:max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#0052FF] via-[#00D2FF] to-[#7C3AED] opacity-35 blur-md" />
              <div className="relative rounded-xl border border-[var(--border-gold)] bg-[var(--bg-card)] p-3.5 shadow-xl backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-lg border border-[var(--border-card)]">
                  <img
                    src="/kannanphoto.jpeg"
                    alt={RESUME_DATA.name}
                    className="h-72 sm:h-80 w-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{RESUME_DATA.name}</div>
                        <div className="text-[10px] text-[#00D2FF]">Senior Lead Software Engineer</div>
                      </div>
                      <div className="rounded bg-slate-900/90 border border-[#00D2FF]/40 px-1.5 py-0.5 font-mono text-[9px] text-slate-200 cursor-default select-none">
                        10.5+ Yrs Exp
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 text-[11px] theme-sub cursor-default select-none">
                  <span><strong className="theme-gold-text">{content.hero.mobileStrip}</strong></span>
                  <span>Notice: <strong className="theme-title">60 Days</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Headline & Value Proposition */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-7">
            
            {/* Informational Status Tags (Explicitly non-interactive, cursor-default) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full theme-gold-badge px-3.5 py-1.5 text-xs font-semibold shadow-sm cursor-default select-none">
                <span>{content.flag}</span>
                <span>{content.hero.statusBadge}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-medium theme-sub cursor-default select-none">
                <Calendar className="h-3.5 w-3.5 theme-cyan-text" />
                <span>Notice: {RESUME_DATA.relocation.noticePeriod}</span>
              </span>

              {content.hero.contactBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 cursor-default select-none">
                  <PhoneForwarded className="h-3.5 w-3.5" />
                  <span>{content.hero.contactBadge}</span>
                </span>
              )}

              {content.hero.visaBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-medium theme-sub cursor-default select-none">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{content.hero.visaBadge}</span>
                </span>
              )}
            </div>

            {/* Name & Title */}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight theme-title sm:text-4xl lg:text-[42px] xl:text-5xl whitespace-nowrap">
                {RESUME_DATA.name}
              </h1>
              <p className="mt-1.5 text-lg font-bold text-gold-gradient sm:text-2xl">
                {RESUME_DATA.title}
              </p>
              <p className="mt-1 font-mono text-[10px] sm:text-xs tracking-wider theme-muted">
                10.5+ YEARS ENTERPRISE SAAS · REACT · MONOREPOS · AI-NATIVE ARCHITECTURE
              </p>
            </div>

            {/* Professional Summary */}
            <p className="text-sm leading-relaxed theme-sub sm:text-lg">
              Specialised in AI-driven development and agentic workflows, LLM orchestration, custom <span className="font-semibold theme-title">Claude Code skills</span>, and <span className="font-semibold theme-gold-text">MCP servers</span>. Proven track record of leading solo platform migrations, cutting build compilation times by <span className="font-bold theme-cyan-text">96%</span>, and establishing safety guardrails across distributed engineering teams.
            </p>

            {/* Core Value Metric Cards (Informational Summary) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 pt-1">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 shadow-sm cursor-default select-none">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0052FF]/15 text-[#38BDF8]">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold theme-title">96% Faster Builds</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted">Webpack 5 ➔ Rspack</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 shadow-sm cursor-default select-none">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-cyan)]/10 theme-cyan-text">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold theme-title">AI-Native Agents</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted">Claude Code & MCP</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 shadow-sm cursor-default select-none">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold theme-title">Monorepo Quality</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted">232 Playwright Specs</div>
                </div>
              </div>
            </div>

            {/* Symmetrically Grouped Action Buttons (Clickable CTAs with clear hover & shadow effects) */}
            <div className="space-y-3 pt-2">
              {/* Row 1: Primary Document & Executive CV Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={content.resumePdf}
                  download={content.resumePdf.split('/').pop()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-[#0052FF]/30 cursor-pointer text-center active:scale-95 shadow-md"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  <span>Download Official PDF Resume</span>
                </a>

                <button
                  onClick={onOpenResumeModal}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-5 py-3 text-xs sm:text-sm font-semibold theme-title transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer text-center active:scale-95"
                >
                  <FileText className="h-4 w-4 shrink-0 theme-cyan-text" />
                  <span>View Resume</span>
                </button>
              </div>

              {/* Row 2: Direct Messaging & BOTIM Copy Button */}
              <div className={`grid grid-cols-1 gap-2.5 ${content.botim ? 'sm:grid-cols-2' : ''}`}>
                <a
                  href={`https://wa.me/${RESUME_DATA.contact.phoneClean}?text=${encodeURIComponent(content.hero.whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 dark:bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-white dark:text-emerald-400 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500/20 text-center active:scale-95 cursor-pointer shadow-md"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>WhatsApp Direct Chat</span>
                </a>

                {content.botim && (
                  <button
                    onClick={handleCopyBotim}
                    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 transition-all hover:bg-cyan-500/20 cursor-pointer text-center active:scale-95"
                  >
                    {copiedBotim ? <Check className="h-4 w-4 shrink-0 text-cyan-400" /> : <PhoneForwarded className="h-4 w-4 shrink-0" />}
                    <span>{copiedBotim ? "BOTIM Handle Copied!" : "BOTIM App Handle"}</span>
                    {!copiedBotim && <Copy className="h-3 w-3 shrink-0 ml-1 text-cyan-400/70" />}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Desktop Executive Photo Card */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#0052FF] via-[#00D2FF] to-[#7C3AED] opacity-35 blur-md transition duration-500 group-hover:opacity-50" />
              
              <div className="relative rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] p-4 shadow-xl backdrop-blur-xl">
                <div className="relative mb-5 overflow-hidden rounded-xl border border-[var(--border-card)]">
                  <img
                    src="/kannanphoto.jpeg"
                    alt={RESUME_DATA.name}
                    className="h-84 w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-3.5 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{RESUME_DATA.name}</div>
                        <div className="text-xs text-[#00D2FF]">Senior Lead Software Engineer</div>
                      </div>
                      <div className="rounded-md bg-slate-900/90 border border-[#00D2FF]/40 px-2 py-1 font-mono text-[10px] text-slate-200 cursor-default select-none">
                        10.5+ Yrs Exp
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs theme-sub cursor-default select-none">
                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">Target Role:</span>
                    <span className="font-semibold theme-title">Lead Software Engineer / Engineering Manager</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">{content.hero.readinessLabel}</span>
                    <span className="font-semibold theme-gold-text">{content.hero.readinessValue}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">{content.hero.contactLabel}</span>
                    <span className="font-semibold text-cyan-400">{content.hero.contactValue}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">Current Position:</span>
                    <span className="font-semibold theme-title">SuperOps (Senior Lead)</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">Languages:</span>
                    <span className="font-semibold theme-sub">English (Fluent) · Tamil · Hindi</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
