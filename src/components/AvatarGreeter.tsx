import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { AVATAR_COPY, AVATAR_GLB_URL } from '../data/avatar';

/* The three.js scene lives behind a dynamic import that is only triggered
   after load + idle, so it never competes with first paint. */
const AvatarScene = lazy(() => import('./AvatarScene'));

/* With no GLB configured the greeter is off in production, but dev still shows
   the layout so the entrance, the bubble copy and the chat wiring are
   reviewable before the model exists. */
const PLACEHOLDER = !AVATAR_GLB_URL;
const ENABLED = !PLACEHOLDER || import.meta.env.DEV;

const DISMISS_KEY = 'avatar-greeter-dismissed';

const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false; // private windows throw on access
  }
};

const writeDismissed = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1');
  } catch {
    /* nothing to persist to; the greeter just returns next reload */
  }
};

/** Runs `fn` once the page is loaded and the main thread is free. */
const whenIdle = (fn: () => void) => {
  let idleHandle: number | undefined;
  const schedule = () => {
    const ric = (window as unknown as { requestIdleCallback?: typeof window.requestIdleCallback })
      .requestIdleCallback;
    idleHandle = ric
      ? ric(() => fn(), { timeout: 3000 })
      : window.setTimeout(fn, 1200); // Safari has no requestIdleCallback
  };

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }

  return () => {
    window.removeEventListener('load', schedule);
    if (idleHandle === undefined) return;
    const cic = (window as unknown as { cancelIdleCallback?: typeof window.cancelIdleCallback })
      .cancelIdleCallback;
    if (cic) cic(idleHandle);
    else clearTimeout(idleHandle);
  };
};

interface AvatarGreeterProps {
  isChatOpen: boolean;
  onOpenChat: () => void;
}

export const AvatarGreeter: React.FC<AvatarGreeterProps> = ({ isChatOpen, onOpenChat }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [waveNonce, setWaveNonce] = useState(0);

  // Gate on desktop width, motion preference and a prior dismissal, then wait
  // for an idle main thread before pulling the 3D chunk down.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const blocked =
      (!ENABLED && 'no AVATAR_GLB_URL') ||
      (readDismissed() && 'dismissed earlier this session') ||
      (!wide.matches && `viewport is ${window.innerWidth}px, needs 1024px+`) ||
      (calm.matches && 'the OS is set to reduce motion');

    if (blocked) {
      // Four separate gates can hide the greeter, and a silent corner of the
      // page gives no clue which one fired.
      if (import.meta.env.DEV) console.info('[avatar] greeter hidden:', blocked);
      return;
    }

    // Hold it back until the hero is behind them. A fixed corner figure on a
    // 900px viewport lands on top of the hero card, and the fold already has
    // more competing for attention than a recruiter will read.
    let stopScroll = () => {};
    const cancelIdle = whenIdle(() => {
      const check = () => {
        if (window.scrollY < window.innerHeight * 0.6) return;
        stopScroll();
        setIsMounted(true);
      };
      window.addEventListener('scroll', check, { passive: true });
      stopScroll = () => window.removeEventListener('scroll', check);
      check();
    });

    return () => {
      cancelIdle();
      stopScroll();
    };
  }, []);

  // Slide up on the frame after mount so the transition actually runs.
  useEffect(() => {
    if (!isMounted) return;
    const id = requestAnimationFrame(() => setIsEntered(true));
    return () => cancelAnimationFrame(id);
  }, [isMounted]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    writeDismissed();
  }, []);

  // A spin drag ends in a click on the same element, so a wave only fires
  // when the pointer barely moved.
  const pressRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pressRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleAvatarClick = useCallback((e: React.MouseEvent) => {
    const from = pressRef.current;
    pressRef.current = null;
    if (from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > 5) return;
    setWaveNonce((n) => n + 1);
  }, []);

  if (!ENABLED || !isMounted || isDismissed) return null;

  return (
    <div
      // Sits above DocMindOverlay's bottom ask bar (bottom-4 h-14) and below
      // the overlay itself, and gets out of the way once the chat is open.
      // `invisible` while hidden, not just opacity-0: the CTA and the avatar
      // are focusable, and an opacity-0 layer keeps them in the tab order.
      className={`pointer-events-none fixed right-4 bottom-24 z-40 hidden lg:block transition-all duration-700 ease-out ${
        isEntered && !isChatOpen
          ? 'translate-y-0 opacity-100'
          : 'invisible translate-y-16 opacity-0'
      }`}
    >
      <div className="flex flex-col items-end gap-3">
        {/* Speech bubble */}
        <div
          className="pointer-events-auto relative w-72 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-2xl"
          role="dialog"
          aria-label="Greeting from Kannan"
        >
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss the greeting"
            className="absolute top-2 right-2 rounded-full p-1 text-[var(--text-body)] opacity-50 transition hover:bg-[var(--bg-card-hover)] hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <p className="text-sm font-semibold text-[var(--text-body)]">{AVATAR_COPY.greeting}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-body)] opacity-75">
            {AVATAR_COPY.body}
          </p>

          <button
            type="button"
            onClick={onOpenChat}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {AVATAR_COPY.cta}
          </button>

          {/* Tail pointing down at the avatar */}
          <span className="absolute -bottom-1.5 right-10 h-3 w-3 rotate-45 border-r border-b border-[var(--border-card)] bg-[var(--bg-card)]" />
        </div>

        {/* Avatar canvas */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onClick={handleAvatarClick}
          aria-label="Wave back at Kannan and reopen the greeting; drag to turn the figure around"
          className="pointer-events-auto h-72 w-52 cursor-pointer bg-transparent"
        >
          {PLACEHOLDER ? (
            <span className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] p-3 text-center text-[10px] leading-snug text-[var(--text-body)] opacity-60">
              3D avatar renders here once AVATAR_GLB_URL is set in
              src/data/avatar.ts
            </span>
          ) : (
            <Suspense fallback={null}>
              <AvatarScene waveNonce={waveNonce} paused={isChatOpen} />
            </Suspense>
          )}
        </button>
      </div>
    </div>
  );
};
