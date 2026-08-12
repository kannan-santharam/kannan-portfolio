import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

export const ExperienceTimeline: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(RESUME_DATA.experiences[0].id);

  const activeExp = RESUME_DATA.experiences.find(exp => exp.id === selectedId) || RESUME_DATA.experiences[0];

  return (
    <section id="experience" className="py-12 sm:py-16 bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full theme-gold-badge px-3.5 py-1 text-xs font-semibold">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Career History & Track Record</span>
          </div>
          <h2 className="mt-2.5 text-2xl font-extrabold theme-title sm:text-4xl">
            10.5+ Years Monorepo & SaaS Leadership
          </h2>
          <p className="mt-1.5 max-w-3xl text-xs sm:text-base theme-sub">
            Progressive leadership positions across high-growth global technology companies in Chennai and Bengaluru, India.
          </p>
        </div>

        {/* Mobile Horizontally Scrollable Selector Strip */}
        <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:hidden">
          {RESUME_DATA.experiences.map((exp) => {
            const isSelected = exp.id === selectedId;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedId(exp.id)}
                className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--border-gold)] bg-[var(--bg-card-hover)] shadow-md font-bold'
                    : 'border-[var(--border-card)] bg-[var(--bg-card)] theme-sub'
                }`}
              >
                <div className="text-xs font-bold theme-title">{exp.company}</div>
                <div className="text-[10px] theme-gold-text">{exp.period}</div>
              </button>
            );
          })}
        </div>

        {/* Layout: Desktop Sidebar on left, Detailed card on right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* Experience Tabs Sidebar (Desktop) */}
          <div className="hidden space-y-3 lg:block lg:col-span-4">
            {RESUME_DATA.experiences.map((exp) => {
              const isSelected = exp.id === selectedId;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--border-gold)] bg-[var(--bg-card-hover)] shadow-xl'
                      : 'border-[var(--border-card)] bg-[var(--bg-card)] theme-sub hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-bold ${isSelected ? 'theme-title' : 'theme-sub'}`}>
                      {exp.company}
                    </span>
                    {exp.featured && (
                      <span className="rounded-full theme-gold-badge px-2 py-0.5 text-[10px] font-bold">
                        Key Role
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 text-xs font-semibold theme-gold-text">
                    {exp.title}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] theme-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Experience Details Display Panel */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              {/* Header */}
              <div className="border-b border-[var(--border-card)] pb-5 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-3xl font-extrabold theme-title">
                      {activeExp.title}
                    </h3>
                    <div className="mt-0.5 text-base sm:text-lg font-bold theme-gold-text">
                      {activeExp.company}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1 text-xs font-mono theme-sub">
                      <Calendar className="h-3.5 w-3.5 theme-cyan-text" />
                      <span>{activeExp.period}</span>
                    </div>
                    <div className="mt-1 text-xs theme-muted">{activeExp.location}</div>
                  </div>
                </div>

                {/* Progression Track Badge */}
                {activeExp.progression && (
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 rounded-xl theme-gold-badge p-2.5 sm:p-3 text-xs font-medium">
                    <Award className="h-4 w-4 shrink-0" />
                    <span>Progression Track: {activeExp.progression}</span>
                  </div>
                )}
              </div>

              {/* Highlights List */}
              <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider theme-muted">
                  Key Achievements & Responsibilities
                </h4>

                <ul className="space-y-2.5 sm:space-y-3">
                  {activeExp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm theme-sub leading-relaxed">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 theme-gold-text mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Tags */}
              <div className="mt-6 sm:mt-8 border-t border-[var(--border-card)] pt-5 sm:pt-6">
                <h4 className="mb-2.5 sm:mb-3 text-xs font-bold uppercase tracking-wider theme-muted">
                  Technologies & Standards Applied
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeExp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-lg border border-[var(--border-card)] bg-[var(--bg-inner)] px-2.5 py-1 text-[11px] font-mono font-medium theme-cyan-text"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
