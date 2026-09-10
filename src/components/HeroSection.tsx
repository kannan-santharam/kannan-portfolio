import React from 'react';
import {
  ArrowDown,
  Bot,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Users,
  Zap,
  Download,
} from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';
import { useRegion } from '../context/RegionContext';

export const HeroSection: React.FC = () => {
  const { content } = useRegion();

  // Matches the navbar's scroll offset so the section heading clears the
  // fixed header.
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
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
                    className="h-56 sm:h-72 w-full object-cover object-top"
                  />
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

              {content.hero.visaBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-medium theme-sub cursor-default select-none">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{content.hero.visaBadge}</span>
                </span>
              )}
            </div>

            {/* Name & Title */}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight theme-title sm:text-4xl lg:text-[42px] xl:text-5xl whitespace-normal sm:whitespace-nowrap">
                {RESUME_DATA.name}
              </h1>
              <p className="mt-1.5 text-lg font-bold text-gold-gradient sm:text-2xl">
                {RESUME_DATA.title}
              </p>
              <p className="mt-1 font-mono text-[10px] sm:text-xs tracking-wider theme-muted">
                {content.hero.roleLine}
              </p>
            </div>

            {/* Professional Summary */}
            <p className="text-sm leading-relaxed theme-sub sm:text-lg">
              I <span className="font-semibold theme-title">lead a frontend team of 4 to 6</span> at SuperOps and own delivery across React, TypeScript and Node.js, with <span className="font-semibold theme-title">10.5+ years</span> in enterprise SaaS. Architected an <span className="font-semibold theme-title">AI test-authoring platform</span> that generates, runs and self-heals end-to-end suites, and a headless <span className="font-semibold theme-gold-text">Base UI design system</span> whose Figma-to-component skill takes page development from 2 days to <span className="font-bold theme-cyan-text">a few hours</span>.
            </p>

            {/* Core Value Metric Cards (Informational Summary) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 pt-1">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 shadow-sm cursor-default select-none">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-cyan)]/10 theme-cyan-text">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold theme-title">Team of 4 to 6</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted">Frontend engineers led</div>
                </div>
              </div>

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
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold theme-title">AI-Native Agents</div>
                  <div className="text-[10px] sm:text-[11px] theme-muted">Claude Code & MCP</div>
                </div>
              </div>
            </div>

            {/* Primary Actions. One document CTA and one direct-contact CTA:
                a recruiter does one thing here, and WhatsApp is the channel
                both regions actually answer on. */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <a
                href={content.resumePdf}
                download={content.resumePdf.split('/').pop()}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-[#0052FF]/30 cursor-pointer text-center active:scale-95 shadow-md"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>Download CV (PDF)</span>
              </a>

              <a
                href={`https://wa.me/${RESUME_DATA.contact.phoneClean}?text=${encodeURIComponent(content.hero.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-600 dark:bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-white dark:text-emerald-400 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500/20 text-center active:scale-95 cursor-pointer shadow-md"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>WhatsApp Direct Chat</span>
              </a>

              {/* Routes to the contact block, which carries the channels the
                  WhatsApp button does not. The label comes from the region
                  profile because those channels differ by region. */}
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 text-xs sm:text-sm font-semibold theme-title transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer text-center active:scale-95"
              >
                <ArrowDown className="h-4 w-4 shrink-0 theme-cyan-text" />
                <span>{content.hero.contactCtaLabel}</span>
              </button>
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
                </div>

                <div className="space-y-2.5 text-xs theme-sub cursor-default select-none">
                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">Target Role:</span>
                    <span className="font-semibold theme-title">{content.hero.targetRole}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] p-2.5 border border-[var(--border-card)]">
                    <span className="theme-muted">Current Position:</span>
                    <span className="font-semibold theme-title">SuperOps · Senior Lead</span>
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
