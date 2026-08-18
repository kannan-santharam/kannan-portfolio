import React, { useState } from 'react';
import { Cpu, Flame } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

export const SkillMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'ai', label: 'AI & Agentic' },
    { id: 'frontend', label: 'Frontend Core' },
    { id: 'state', label: 'State & Data' },
    { id: 'architecture', label: 'Architecture & Build' },
    { id: 'devops', label: 'Testing & Cloud' },
    { id: 'leadership', label: 'Leadership' },
  ];

  const filteredCategories = selectedCategory === 'all'
    ? RESUME_DATA.skillCategories
    : RESUME_DATA.skillCategories.filter(cat => cat.category === selectedCategory);

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

          {/* Touch-Friendly Horizontally Scrollable Filter Strip on Mobile */}
          <div className="mt-6 flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-1.5 pb-2 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00D2FF] text-white font-bold shadow-md'
                    : 'border border-[var(--border-card)] bg-[var(--bg-card)] theme-sub hover:border-[var(--border-gold)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((catGroup, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xl transition-all hover:border-[var(--border-gold)]"
            >
              <div className="mb-3.5 border-b border-[var(--border-card)] pb-3">
                <h3 className="text-base sm:text-lg font-bold theme-title flex items-center justify-between">
                  <span>{catGroup.title}</span>
                  <span className="text-xs font-mono theme-gold-text">{catGroup.skills.length} skills</span>
                </h3>
              </div>

              <div className="space-y-2">
                {catGroup.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between rounded-lg bg-[var(--bg-inner)] px-3 py-2 border border-[var(--border-card)]"
                  >
                    <div className="flex items-center gap-2">
                      {skill.hot && <Flame className="h-3.5 w-3.5 theme-gold-text shrink-0" />}
                      <span className="text-xs font-medium theme-title">{skill.name}</span>
                    </div>

                    {skill.level && (
                      <span className={`rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        skill.level === 'Expert'
                          ? 'theme-gold-badge'
                          : skill.level === 'Advanced'
                          ? 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30'
                          : 'bg-[var(--bg-pill)] theme-sub border border-[var(--border-card)]'
                      }`}>
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
