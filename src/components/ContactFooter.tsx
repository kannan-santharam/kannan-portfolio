import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Copy, Check, Download, Send, Sparkles, BookOpen } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

export const ContactFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Kannan Santharam
TITLE:Senior Lead Frontend Engineer
ORG:SuperOps
TEL;TYPE=CELL:${RESUME_DATA.contact.phone}
EMAIL:${RESUME_DATA.contact.email}
URL:${RESUME_DATA.contact.linkedin}
NOTE:Senior Lead Frontend Engineer | React 19, TypeScript, AI-Native Engineering. Ready to Relocate to Dubai, UAE.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kannan_Santharam_Dubai.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

              {/* Technical Architecture & Interview Prep PDF Download */}
              <a
                href="/Portfolio_Technical_Doc_Interview_Prep.pdf"
                download="Portfolio_Technical_Doc_Interview_Prep.pdf"
                className="flex w-full items-center justify-between rounded-xl border border-[var(--border-gold)] bg-[var(--bg-inner)] p-3.5 text-xs font-bold theme-gold-text transition-all hover:bg-[var(--bg-card-hover)]"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4" />
                  <span>Download Architecture & Interview PDF</span>
                </div>
                <Download className="h-4 w-4" />
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${RESUME_DATA.contact.phoneClean}?text=Hi%20Kannan,%20I'm%20reaching%20out%20regarding%20a%20Lead%20Frontend%20role%20in%20Dubai.`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat on WhatsApp</span>
                </div>
                <span className="text-xs font-mono">{RESUME_DATA.contact.phone}</span>
              </a>

              {/* LinkedIn & VCard Row */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={RESUME_DATA.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)]"
                >
                  <svg className="h-4 w-4 fill-[var(--color-cyan)]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>

                <button
                  onClick={handleDownloadVCard}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] p-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)] cursor-pointer"
                >
                  <Download className="h-4 w-4 theme-gold-text" />
                  <span>Save VCard Contact</span>
                </button>
              </div>

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
