import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bot, Sparkles, Loader2, FileSearch } from 'lucide-react';

const DOCMIND_URL = 'https://docmind-rag-llm.vercel.app';

interface DocMindOverlayProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocMindOverlay: React.FC<DocMindOverlayProps> = ({ isOpen, onOpenChange }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Expand the input bar to full screen, then swap in the overlay
  const launchOverlay = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setTimeout(() => {
      onOpenChange(true);
      setIsLaunching(false);
    }, 350);
  };

  // Escape closes the overlay; body scroll is locked while it is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      setIsIframeLoaded(false);
    };
  }, [isOpen, onOpenChange]);

  return (
    <>
      {/* Bottom Scrim — fades out page content behind the ask bar */}
      {!isOpen && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 sm:h-28"
          style={{ background: 'linear-gradient(to top, var(--bg-page) 45%, transparent)' }}
        />
      )}

      {/* Fixed Bottom Ask Bar — focusing it expands to the full-screen overlay */}
      {!isOpen && (
        <div
          className={`fixed inset-x-0 z-40 transition-all duration-300 ease-out ${
            isLaunching ? 'bottom-0 h-[100dvh]' : 'bottom-3 h-12 sm:bottom-4 sm:h-14'
          }`}
        >
          {/* Width-matches the page content container (max-w-7xl + section padding) */}
          <div
            className={`mx-auto h-full transition-all duration-300 ease-out ${
              isLaunching ? 'max-w-[100vw] px-0' : 'max-w-7xl px-4 sm:px-6 lg:px-8'
            }`}
          >
          <div
            className={`group relative h-full overflow-hidden bg-[var(--border-card)] p-[2px] shadow-2xl transition-all duration-300 ${
              isLaunching ? 'rounded-none' : 'rounded-full'
            }`}
          >
            {/* Comet Light Circling the Border */}
            <span className="absolute inset-0 animate-border-run" />

            {/* Inner Input Bar */}
            <div
              className={`relative flex h-full w-full items-center gap-2.5 px-3.5 sm:px-4 transition-all duration-300 ${
                isLaunching ? 'rounded-none bg-[var(--bg-page)]' : 'rounded-full bg-[#0B0E14]'
              }`}
            >
              <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#182030] text-[#00D2FF] sm:h-7 sm:w-7">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0B0E14] sm:h-2.5 sm:w-2.5" />
              </div>
              <input
                type="text"
                readOnly
                placeholder="Ask the AI about Kannan's experience, skills, or Dubai move…"
                aria-label="Open DocMind AI Assistant"
                onFocus={(e) => {
                  e.currentTarget.blur();
                  launchOverlay();
                }}
                onClick={launchOverlay}
                className="min-w-0 flex-1 cursor-pointer bg-transparent text-xs font-semibold text-slate-100 placeholder:text-slate-400 outline-none sm:text-sm"
              />
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#00D2FF] transition-transform group-hover:rotate-12" />
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Full-Screen DocMind Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-[var(--bg-page)]">

          {/* Top Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 sm:px-4">
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-1.5 text-xs sm:text-sm font-semibold theme-title transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 theme-cyan-text" />
              <span>Back to portfolio</span>
            </button>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 theme-cyan-text" />
              <span className="text-sm font-extrabold theme-title">DocMind</span>
            </div>
          </div>

          {/* Loading state behind the iframe — first hit is a cold serverless start */}
          <div className="relative flex-1">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-page)]">
                <Loader2 className="h-8 w-8 animate-spin theme-cyan-text" />
                <p className="text-sm theme-sub">Waking up DocMind…</p>
              </div>
            )}
            <iframe
              src={DOCMIND_URL}
              title="DocMind — agentic RAG chatbot"
              allow="clipboard-write"
              onLoad={() => setIsIframeLoaded(true)}
              className="h-full w-full border-0"
            />
          </div>

        </div>
      )}
    </>
  );
};
