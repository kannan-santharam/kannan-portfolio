import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Copy, Check, Send, Sparkles, PhoneCall, Zap, Globe } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

export const ContactFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWaUrl = (text: string) => {
    return `https://wa.me/${RESUME_DATA.contact.phoneClean}?text=${encodeURIComponent(text)}`;
  };

  const quickTopics = [
    {
      id: 'dubai',
      label: '🇦🇪 Dubai Role Inquiry',
      icon: Globe,
      message: 'Hi Kannan, I reviewed your executive portfolio and would like to discuss a Lead Engineering role in Dubai, UAE.'
    },
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
              <div className="inline-flex items-center gap-2 rounded-full theme-gold-badge px-3.5 py-1 text-xs font-semibold">
                <span>🇦🇪 Available for Dubai, UAE Hiring</span>
              </div>
              
              <h2 className="text-3xl font-extrabold theme-title sm:text-4xl">
                Ready to Lead & Accelerate Frontend Engineering in Dubai
              </h2>

              <p className="text-sm theme-sub leading-relaxed max-w-xl">
                Seeking a Lead Frontend Engineer or Engineering Manager position with a tech product company in Dubai. Available on 60 days notice with full mobility for visa processing.
              </p>

              {/* Quick WhatsApp Topic Presets with Hover Message Tooltips */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold theme-title flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Instant WhatsApp Quick-Ping Topics (Hover for message preview):</span>
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm"
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

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono theme-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 theme-gold-text" />
                  Dubai Relocation Ready
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

            {/* Right Action Grid */}
            <div className="space-y-3 lg:col-span-5">
              
              {/* Direct Mail Button */}
              <a
                href={`mailto:${RESUME_DATA.contact.email}?subject=Dubai%20Engineering%20Opportunity%20-%20Kannan%20Santharam`}
                className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#E2B755] to-[#C29633] p-4 font-bold text-[#07090E] transition-all hover:scale-[1.01] hover:brightness-110 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>Send Direct Email</span>
                </div>
                <Send className="h-4 w-4" />
              </a>

              {/* WhatsApp Button */}
              <a
                href={getWaUrl("Hi Kannan, I'm reaching out regarding a Lead Frontend / Engineering Manager role in Dubai.")}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                  <span>Direct WhatsApp Chat</span>
                </div>
                <span className="text-xs font-mono">{RESUME_DATA.contact.phone}</span>
              </a>

              {/* LinkedIn Button */}
              <a
                href={RESUME_DATA.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)]"
              >
                <svg className="h-4 w-4 fill-[var(--color-cyan)]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>Connect on LinkedIn</span>
              </a>

              {/* Copy Email Helper */}
              <button
                onClick={handleCopyEmail}
                className="flex w-full items-center justify-center gap-2 text-xs theme-muted hover:text-[var(--color-gold)] pt-1 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Email copied to clipboard!" : `Click to copy: ${RESUME_DATA.contact.email}`}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Footer Sub-bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-card)] pt-8 sm:flex-row text-xs theme-muted">
          <div>
            © {new Date().getFullYear()} Kannan Santharam. Built with React 19 + React Compiler & Tailwind CSS.
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] theme-gold-text">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dubai, UAE Executive Portfolio Edition</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
