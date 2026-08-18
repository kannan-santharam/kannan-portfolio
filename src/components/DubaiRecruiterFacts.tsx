import React from 'react';
import { Plane, Clock, Award, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export const DubaiRecruiterFacts: React.FC = () => {
  const facts = [
    {
      label: "Relocation Target",
      value: "Dubai, UAE 🇦🇪",
      subtext: "Actively seeking roles across the Dubai tech ecosystem",
      icon: Plane,
      color: "theme-gold-text"
    },
    {
      label: "Visa Sponsorship Status",
      value: "Employment Visa Required",
      subtext: "Requires standard UAE Employment Visa sponsorship from employer",
      icon: ShieldCheck,
      color: "text-emerald-500"
    },
    {
      label: "Notice Period",
      value: "60 Days",
      subtext: "Standard transition period from current Senior Lead role at SuperOps",
      icon: Clock,
      color: "theme-cyan-text"
    },
    {
      label: "Direct UAE Communication",
      value: "BOTIM & WhatsApp Active",
      subtext: "Available on BOTIM App (+91 97902 47499) for UAE VoIP calling & messaging",
      icon: MessageSquare,
      color: "text-[#00F2FE]"
    }
  ];

  return (
    <section id="dubai-facts" className="py-12 bg-[var(--bg-page)] text-[var(--text-body)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#0052FF]/15 blur-3xl" />

          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider theme-gold-text">
                <Award className="h-4 w-4" />
                <span>Executive Recruiter Summary</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold theme-title sm:text-3xl">
                Dubai & UAE Hiring Checklist
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Full Mobility Readiness</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-4 transition-all hover:border-[var(--border-gold)] shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium theme-sub">{item.label}</span>
                    <IconComp className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="text-lg font-bold theme-title">{item.value}</div>
                  <div className="mt-1 text-xs theme-muted">{item.subtext}</div>
                </div>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-card)] pt-4 text-xs theme-sub">
            <div className="flex items-center gap-2">
              <span className="font-semibold theme-gold-text">Language Proficiency:</span>
              <span>English (Fluent Professional) · Tamil (Native) · Hindi (Basic)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold theme-title">Target Designation:</span>
              <span className="theme-sub">Lead Software Engineer / Engineering Manager</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
