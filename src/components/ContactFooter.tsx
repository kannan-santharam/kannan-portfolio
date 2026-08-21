import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Copy, Check, Sparkles, PhoneCall, Zap, Globe, PhoneForwarded } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';
import { useRegion } from '../context/RegionContext';

export const ContactFooter: React.FC = () => {
  const { content } = useRegion();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBotim, setCopiedBotim] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyBotim = () => {
    navigator.clipboard.writeText(RESUME_DATA.contact.phone);
    setCopiedBotim(true);
    setTimeout(() => setCopiedBotim(false), 2000);
  };

  const getWaUrl = (text: string) => {
    return `https://wa.me/${RESUME_DATA.contact.phoneClean}?text=${encodeURIComponent(text)}`;
  };

  const quickTopics = [
    ...(content.footer.quickTopic
      ? [{
          id: content.code,
          label: content.footer.quickTopic.label,
          icon: Globe,
          message: content.footer.quickTopic.message,
        }]
      : []),
    {
      id: 'rspack',
      label: '⚡ 96% Rspack Build Speedup',
      icon: Zap,
      message: "Hi Kannan, I'm interested in your 96% monorepo build speedup win (Webpack 5 to Rspack). Let's connect."
    },
    {
      id: 'call',
      label: '📞 Schedule 15-Min Call',
      icon: PhoneCall,
      message: "Hi Kannan, I'd like to schedule a 15-minute introductory phone screening call regarding a position."
    }
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-[var(--bg-page)] text-[var(--text-body)] border-t border-[var(--border-card)] pt-16 pb-12 transition-colors duration-250">
      {/* Radial Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-96 -translate-x-1/2 rounded-full bg-[#E2B755]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Container */}
        <div className="relative rounded-3xl border border-[var(--border-gold)] bg-[var(--bg-card)] p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            {/* Left Info */}
            <div className="space-y-4 lg:col-span-7">
              {/* Informational Status Badges (cursor-default) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full theme-gold-badge px-3.5 py-1 text-xs font-semibold cursor-default select-none">
                  {content.footer.bannerBadge}
                </span>
                {content.botim && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 cursor-default select-none">
                    <PhoneForwarded className="h-3.5 w-3.5" />
                    <span>BOTIM App Active</span>
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold theme-title sm:text-4xl">
                {content.footer.heading}
              </h2>

              <p className="text-sm theme-sub leading-relaxed max-w-xl">
                {content.footer.paragraph}
              </p>

              {/* Quick WhatsApp Topic Presets with Hover Message Tooltips (Clickable Actions) */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold theme-title flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  <span>WhatsApp Quick-Ping Topics (Hover for message preview):</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {quickTopics.map((topic) => {
                    const IconComponent = topic.icon;
                    return (
                      <div key={topic.id} className="group relative inline-block">
                        <a
                          href={getWaUrl(topic.message)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-white dark:text-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                          <span>{topic.label}</span>
                        </a>

                        {/* Hover Tooltip displaying exact pre-filled WhatsApp message */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center w-64 z-30 transition-all duration-200">
                          <div className="rounded-xl border border-[var(--border-gold)] bg-slate-950 p-2.5 text-[11px] text-slate-200 shadow-2xl backdrop-blur-md leading-snug text-center">
                            <span className="block font-bold text-[#E2B755] text-[10px] uppercase tracking-wider mb-1">Pre-filled WhatsApp Message</span>
                            "{topic.message}"
                          </div>
                          <div className="h-2 w-2 -mt-1 rotate-45 border-r border-b border-[var(--border-gold)] bg-slate-950" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono theme-muted cursor-default select-none">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 theme-gold-text" />
                  {content.footer.monoLine}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 theme-cyan-text" />
                  {RESUME_DATA.contact.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-purple-500" />
                  {RESUME_DATA.contact.email}
                </span>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="space-y-3 lg:col-span-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-page)] p-6 shadow-inner">
              
              {/* WhatsApp Direct CTA */}
              <a
                href={getWaUrl("Hi Kannan, I reviewed your executive portfolio and would like to connect.")}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-95 cursor-pointer shadow-md"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Start Direct WhatsApp Chat</span>
              </a>

              {/* BOTIM App CTA */}
              {content.botim && (
                <button
                  onClick={handleCopyBotim}
                  className="flex w-full items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 transition-all hover:bg-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PhoneForwarded className="h-4 w-4 shrink-0" />
                    <span>{copiedBotim ? "BOTIM Handle Copied!" : "BOTIM VoIP Handle"}</span>
                  </span>
                  <span className="font-mono text-xs opacity-80 flex items-center gap-1">
                    {copiedBotim ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {RESUME_DATA.contact.phone}
                  </span>
                </button>
              )}

              {/* LinkedIn & GitHub Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={RESUME_DATA.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-primary)] cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4 fill-[var(--color-cyan)]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href={RESUME_DATA.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-primary)] cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4 fill-current text-[#38BDF8]" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>

              {/* Copy Email Helper */}
              <button
                onClick={handleCopyEmail}
                className="flex w-full items-center justify-center gap-2 text-xs theme-muted hover:text-[var(--color-primary)] pt-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedEmail ? "Email copied to clipboard!" : `Click to copy: ${RESUME_DATA.contact.email}`}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer Sub-bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-card)] pt-8 sm:flex-row text-xs theme-muted">
          <div>
            © {new Date().getFullYear()} Kannan Santharam. Built with React & Tailwind CSS.
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] theme-gold-text cursor-default select-none">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{content.footer.editionLabel}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
