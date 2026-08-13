import React, { useState } from 'react';
import { FileText, Menu, X, Sun, Moon, Download, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenResumeModal: () => void;
  onOpenChat: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal, onOpenChat, activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Impact Wins', id: 'metrics' },
    { name: 'AI & Architecture', id: 'ai-spotlight' },
    { name: 'Experience', id: 'experience' },
    { name: 'Technical Skills', id: 'skills' },
    { name: 'Relocation & Visa', id: 'dubai-facts' },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b theme-nav backdrop-blur-md transition-colors duration-250 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 lg:px-8 gap-2">
        
        {/* Brand / Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
          className="group flex items-center gap-2 shrink-0"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E2B755] to-[#9A7426] p-0.5 shadow-md shadow-[#E2B755]/10 transition-transform group-hover:scale-105 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#07090E] font-mono text-xs sm:text-sm font-bold text-[#E2B755]">
              KS
            </div>
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-1">
              <span className="font-bold tracking-tight text-xs sm:text-base theme-title whitespace-nowrap">
                <span className="hidden sm:inline">{RESUME_DATA.name}</span>
                <span className="inline sm:hidden">Kannan Santharam</span>
              </span>
            </div>
            <p className="text-[9px] sm:text-xs theme-muted whitespace-nowrap">React · TypeScript · AI-Native</p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center justify-center gap-1 md:flex lg:gap-1.5 mx-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'theme-gold-badge shadow-sm font-bold'
                    : 'theme-sub hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-title)]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--color-gold)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Theme Switcher (Desktop) */}
        <div className="hidden items-center gap-2 md:flex shrink-0">
          <div className="hidden items-center gap-1.5 rounded-full theme-gold-badge px-2.5 py-1 text-xs font-semibold xl:flex">
            <span className="text-sm">🇦🇪</span>
            <span>Dubai Ready</span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-title)] transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-[#E2B755]" /> : <Moon className="h-4 w-4 text-[#B88820]" />}
          </button>

          <a
            href="/Kannan_Santharam.pdf"
            download="Kannan_Santharam_Senior_Lead_Software_Engineer.pdf"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
            title="Download PDF Resume"
          >
            <Download className="h-3.5 w-3.5 theme-gold-text" />
            <span>PDF</span>
          </a>

          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold theme-title transition-all hover:border-[var(--color-gold)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 theme-gold-text" />
            <span>View CV</span>
          </button>

          <button
            onClick={onOpenChat}
            className="group relative flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <span className="absolute inset-[-150%] animate-spin-border bg-[conic-gradient(from_0deg,#E2B755_0%,#00F2FE_25%,#A855F7_50%,#34D399_75%,#E2B755_100%)]" />
            <div className="relative flex items-center gap-1.5 rounded-full bg-[#07090E] px-3.5 py-1.5 text-xs font-bold text-white">
              <Bot className="h-3.5 w-3.5 text-[#E2B755]" />
              <span>Ask AI</span>
              <Sparkles className="h-3 w-3 text-[#E2B755] group-hover:rotate-12 transition-transform" />
            </div>
          </button>
        </div>

        {/* Mobile Controls (Touch-Friendly, Fits within 412px S23 Ultra viewport with zero ellipsis) */}
        <div className="flex items-center gap-1.5 md:hidden shrink-0">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-title)] active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-[#E2B755]" /> : <Moon className="h-3.5 w-3.5 text-[#B88820]" />}
          </button>

          <a
            href="/Kannan_Santharam.pdf"
            download="Kannan_Santharam_Senior_Lead_Software_Engineer.pdf"
            className="flex h-8 items-center gap-1 rounded-lg theme-gold-badge px-2 text-[11px] font-bold active:scale-95"
            title="Download PDF Resume"
          >
            <Download className="h-3 w-3" />
            <span>PDF</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] theme-sub active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Full Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border-card)] bg-[var(--bg-page)] px-4 pb-6 pt-3 backdrop-blur-xl md:hidden shadow-2xl">
          <div className="mb-3 flex items-center justify-between rounded-xl theme-gold-badge px-3 py-2 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span>🇦🇪</span>
              <span>Ready for Dubai, UAE</span>
            </div>
            <span className="font-bold theme-title">60d Notice</span>
          </div>

          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`block w-full text-left rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'theme-gold-badge font-bold'
                      : 'theme-sub hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-[var(--border-card)]">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenResumeModal(); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] py-2.5 text-xs font-bold theme-title shadow-sm"
            >
              <FileText className="h-4 w-4 theme-gold-text" />
              <span>Interactive Resume Viewer</span>
            </button>

            <a
              href={`https://wa.me/${RESUME_DATA.contact.phoneClean}?text=Hi%20Kannan,%20I'm%20reaching%20out%20regarding%20a%20Lead%20Frontend%20role%20in%20Dubai.`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Direct</span>
            </a>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl p-[1.5px] cursor-pointer"
            >
              <span className="absolute inset-[-150%] animate-spin-border bg-[conic-gradient(from_0deg,#E2B755_0%,#00F2FE_25%,#A855F7_50%,#34D399_75%,#E2B755_100%)]" />
              <div className="relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#07090E] py-2.5 text-xs font-bold text-white">
                <Bot className="h-4 w-4 text-[#E2B755]" />
                <span>Ask Candidate AI</span>
                <Sparkles className="h-3 w-3 text-[#E2B755]" />
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
