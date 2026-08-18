import React from 'react';
import { Zap, Bot, Cpu, ShieldCheck, TrendingUp, Sparkles, Code2 } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

export const MetricsGrid: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="h-6 w-6 theme-cyan-text" />;
      case 'Bot':
        return <Bot className="h-6 w-6 theme-gold-text" />;
      case 'Cpu':
        return <Cpu className="h-6 w-6 text-purple-500" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="h-6 w-6 text-emerald-500" />;
    }
  };

  return (
    <section id="metrics" className="py-16 bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full theme-gold-badge px-4 py-1.5 text-xs font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Proven Engineering Impact</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold theme-title sm:text-4xl">
            High-Impact Monorepo & AI Milestones
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base theme-sub">
            Quantitative architectural achievements delivered across 10.5+ years of scaling enterprise SaaS platforms.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {RESUME_DATA.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-gold)] hover:bg-[var(--bg-card-hover)] shadow-md"
            >
              {/* Top glow line */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#00D2FF]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 shadow-inner">
                  {getIcon(metric.iconName)}
                </div>
                <span className="rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-2.5 py-1 text-[11px] font-mono theme-sub">
                  {metric.badge}
                </span>
              </div>

              {/* Metric Value */}
              <div className="text-3xl font-extrabold theme-title sm:text-4xl group-hover:text-[var(--color-gold)] transition-colors">
                {metric.value}
              </div>

              {/* Label */}
              <div className="mt-1 text-sm font-bold theme-title">
                {metric.label}
              </div>

              {/* Description */}
              <p className="mt-2 text-xs leading-relaxed theme-sub">
                {metric.description}
              </p>

              {/* Subtext */}
              <div className="mt-4 border-t border-[var(--border-card)] pt-3 text-[11px] font-mono theme-cyan-text">
                {metric.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Architecture Banner */}
        <div className="mt-8 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg theme-gold-badge">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold theme-title">Reusable API / UI SDK Integration Framework</h4>
                <p className="text-xs theme-sub">Sole-authored and adopted across SuperOps product teams, standardizing how micro-features consume platform services.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1.5 text-xs font-mono theme-sub">
              <Sparkles className="h-3.5 w-3.5 theme-gold-text" />
              <span>Standardized Service Layer</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
