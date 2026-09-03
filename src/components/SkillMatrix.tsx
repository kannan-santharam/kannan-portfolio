import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

const ALL = 'all';

export const SkillMatrix: React.FC = () => {
  const [selected, setSelected] = useState<string>(ALL);

  // Rail entries come straight from the data, so a rail label can never drift
  // from the group heading it filters to.
  const rail = [
    { id: ALL, label: 'All Skills', count: RESUME_DATA.skillCategories.reduce((n, c) => n + c.skills.length, 0) },
    ...RESUME_DATA.skillCategories.map(c => ({ id: c.category, label: c.title, count: c.skills.length }))
  ];

  const groups = selected === ALL
    ? RESUME_DATA.skillCategories
    : RESUME_DATA.skillCategories.filter(c => c.category === selected);

  return (
    <section id="skills" className="py-12 sm:py-16 bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/10 px-3.5 py-1 text-xs font-semibold theme-cyan-text">
            <Cpu className="h-3.5 w-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="mt-2.5 text-2xl font-extrabold theme-title sm:text-4xl">
            Engineering & Leadership Skill Matrix
          </h2>
          <p className="mx-auto mt-1.5 max-w-2xl text-xs sm:text-base theme-sub">
            Categorized skills honed over 10.5+ years of scaling enterprise client platforms and AI workflows.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">

          {/* Filter rail — vertical on desktop, horizontally scrollable strip on mobile */}
          <nav
            aria-label="Skill categories"
            className="flex shrink-0 gap-1.5 overflow-x-auto no-scrollbar pb-2 lg:w-60 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0 lg:sticky lg:top-24 lg:self-start"
          >
            {rail.map((item) => {
              const active = selected === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all lg:flex lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-l-2 lg:px-3.5 lg:py-2.5 lg:text-left lg:text-sm ${
                    active
                      ? 'bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] font-bold text-white shadow-md lg:border-l-[var(--color-cyan)] lg:bg-none lg:bg-[var(--bg-card)] lg:text-[var(--color-primary)] lg:shadow-none'
                      : 'border border-[var(--border-card)] bg-[var(--bg-card)] theme-sub hover:border-[var(--border-gold)] lg:border-0 lg:border-l-2 lg:border-l-transparent lg:bg-transparent lg:hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="hidden font-mono text-[11px] theme-muted lg:inline">{item.count}</span>
                </button>
              );
            })}
          </nav>

          {/* Skills pane — resume rhythm: a label rule, then the group's skills inline */}
          <div className="min-w-0 flex-1 space-y-7">
            {groups.map((group) => (
              <div key={group.category}>
                <div className="mb-3 flex items-baseline gap-3 border-b border-[var(--border-card)] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider theme-title sm:text-sm">
                    {group.title}
                  </h3>
                  <span className="font-mono text-[11px] theme-muted">{group.skills.length}</span>
                </div>

                <p className="text-sm leading-relaxed theme-sub">
                  {group.skills.map((skill) => skill.name).join(', ')}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
};
