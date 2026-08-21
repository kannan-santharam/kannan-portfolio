import React from 'react';
import { Plane, Clock, Award, CheckCircle2, ShieldCheck, MessageSquare, MapPin } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import type { RecruiterFact } from '../data/regionContent';

const getIcon = (iconName: RecruiterFact['iconName']) => {
  switch (iconName) {
    case 'Plane': return Plane;
    case 'ShieldCheck': return ShieldCheck;
    case 'Clock': return Clock;
    case 'MessageSquare': return MessageSquare;
    case 'MapPin': return MapPin;
  }
};

export const RecruiterFacts: React.FC = () => {
  const { content } = useRegion();

  return (
    <section id="location-facts" className="py-12 bg-[var(--bg-page)] text-[var(--text-body)] transition-colors duration-250">
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
                {content.sectionHeading}
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{content.sectionBadge}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.recruiterFacts.map((item, index) => {
              const IconComp = getIcon(item.iconName);
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
              <span>English (Fluent Professional) · Tamil (Native) · Hindi (Intermediate)</span>
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
