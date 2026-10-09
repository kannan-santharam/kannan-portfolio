import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, CalendarClock, Copy, Download, House, Plane, UserRound, Workflow, X } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';
import { useRegion, regionPathPrefix } from '../context/RegionContext';
import { buildDocMindUrl, DOCMIND_ORIGIN } from '../lib/docmind';
import type { Region } from '../data/regionContent';

/**
 * The home page: a full screen chat, Claude/ChatGPT style.
 *
 * The intro types itself out in the middle, the composer sits under it, and the
 * first question hands off to DocMind, which opens full page in an iframe below
 * the header. DocMind posts `docmind:ready` once its session exists; the
 * question is queued until then and sent once as `docmind:ask`. If DocMind
 * never says ready (an older deploy without the hook, or an untrusted origin),
 * the chat still opens and the visitor is shown their question to paste in.
 */

type Segment = { text: string; className: string; breakAfter?: boolean };

const INTRO: Segment[] = [
  { text: "Hi, I'm ", className: 'theme-sub' },
  { text: RESUME_DATA.name, className: 'font-bold text-gold-gradient' },
  { text: ', Senior Lead Software Engineer.', className: 'theme-sub', breakAfter: true },
  { text: "I can automate your team's frontend development with strict guardrails, cutting a new page from 2\u00A0weeks to 5\u00A0hours.", className: 'font-semibold theme-title sm:text-2xl', breakAfter: true },
  { text: 'Ask anything about me and my work.', className: 'theme-muted text-sm sm:text-lg' }
];

const INTRO_LENGTH = INTRO.reduce((n, s) => n + s.text.length, 0);
const TYPE_MS = 28;                 // about 4 seconds for the whole intro
const HANDOFF_TIMEOUT_MS = 6000;    // how long to wait for DocMind before showing the fallback

const JD_CHIP = 'Paste a job description and see how I match it';
const JD_PROMPT =
  'Here is a job description. How well does Kannan match it? Point out the strongest matches with evidence from his work, and be honest about any gaps.';

// The LinkedIn post about the frontend automation. It opens in a viewer on this
// page; the embed (and LinkedIn's cookies) load only when the visitor asks for it.
const LINKEDIN_POST_URL = 'https://www.linkedin.com/feed/update/urn:li:share:7513608659365675010';
// Shown on phones in place of the embed: the post, shortened.
const POST_EXCERPT = [
  'We have automated 90% of our frontend work at SuperOps. So is frontend dead?',
  'Last year, building a new page took us 2 weeks. Today, a similar new feature takes about only 5 hours to complete.',
  'Our designers design in Claude Design, and Claude agents turn it into production ready code that follows our design system. Another agent takes the API contract from the backend team and integrates the APIs, and Playwright tests are written automatically. Every change has to pass strict guardrails before it can be committed.'
];

const isPhone = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 639px)').matches;

const LINKEDIN_POST_EMBED = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7513608659365675010?collapsed=1';

// Instant short answers shown while DocMind writes the full, cited one.
// Written in the same plain style as the resume.
const QUICK_ANSWERS: Record<string, string> = {
  "How did you automate your team's frontend development?":
    'I automated around 90% of our frontend work at SuperOps. Claude agents turn designs into production code using only our design system, integrate APIs from backend contracts and write the tests. Strict checks block anything that breaks the rules. New page development dropped from about 2 weeks to about 5 hours.',
  'What guardrails keep the AI generated code safe?':
    'Every change the agents make passes the same checks as code written by a person. Colours, sizes and spacing must come from design tokens, plain HTML is blocked, pages are checked as the browser renders them, all text must come from the translation system, and a pre commit hook blocks anything that breaks these rules.',
  'Tell me about your experience leading frontend teams':
    'I lead a frontend team of 6 at SuperOps and run sprint planning, architecture reviews, hiring and performance reviews, while still building features myself. I have hired 9 engineers across SuperOps and Freshworks, with 90% retention.',
  'What is your visa status and notice period?':
    'I am an Indian national based in Chennai and ready to relocate to Dubai. I will need UAE employment visa sponsorship. My notice period is 60 days and it is negotiable.',
  'Where are you based and what is your notice period?':
    'I am based in Chennai, India. My notice period is 60 days and it is negotiable.'
};

const PROOF = [
  { value: '2 weeks → 5 hrs', label: 'new page development' },
  { value: '6 hrs → 40 min', label: 'full regression' },
  { value: '96% faster', label: 'dev builds' }
];

// The automation question leads, always.
const SUGGESTIONS: Record<Region, string[]> = {
  dubai: [
    "How did you automate your team's frontend development?",
    'What guardrails keep the AI generated code safe?',
    'Tell me about your experience leading frontend teams',
    'What is your visa status and notice period?'
  ],
  india: [
    "How did you automate your team's frontend development?",
    'What guardrails keep the AI generated code safe?',
    'Tell me about your experience leading frontend teams',
    'Where are you based and what is your notice period?'
  ]
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const useTypedCount = (total: number) => {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? total : 0));
  useEffect(() => {
    if (count >= total) return;
    const id = window.setTimeout(() => setCount((c) => Math.min(total, c + 1)), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [count, total]);
  return count;
};

const TypedIntro: React.FC = () => {
  const count = useTypedCount(INTRO_LENGTH);
  const done = count >= INTRO_LENGTH;
  let remaining = count;

  return (
    // The full text sits invisibly underneath to hold the final height, so the
    // composer below does not slide down while the intro types.
    <h1 className="grid text-center text-[1.3rem] leading-relaxed sm:text-3xl sm:leading-snug sm:short:text-2xl xshort:text-lg" aria-label={INTRO.map((s) => s.text).join(' ')}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {INTRO.map((seg, i) => (
          <React.Fragment key={i}>
            <span className={seg.className}>{seg.text}</span>
            {seg.breakAfter && <br />}
          </React.Fragment>
        ))}
        <span className="ml-0.5 inline-block w-[2px]" />
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {INTRO.map((seg, i) => {
          const shown = seg.text.slice(0, Math.max(0, remaining));
          remaining -= seg.text.length;
          return (
            <React.Fragment key={i}>
              <span className={seg.className}>{shown}</span>
              {seg.breakAfter && shown.length === seg.text.length && <br />}
            </React.Fragment>
          );
        })}
        <span
          className={`ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-[var(--color-cyan)] ${done ? 'animate-pulse' : ''}`}
        />
      </span>
    </h1>
  );
};

const iconButton =
  'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-title)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer';
const textButton =
  'flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-2.5 sm:px-3 text-xs font-semibold theme-title transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer';

const composerAction =
  'flex items-center gap-1.5 rounded-full border border-[var(--border-card)] px-3 py-1.5 text-xs font-medium theme-sub transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-title)] cursor-pointer';

const WhatsAppIcon = () => (
  <svg className="h-4 w-4 fill-emerald-500" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.45 9.43m8.03-17.46A11.3 11.3 0 0 0 12.04.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.6 23.3l5.69-1.5a11.3 11.3 0 0 0 5.43 1.39h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4 fill-[var(--color-cyan)]" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const ChatHome: React.FC = () => {
  const { region, content } = useRegion();
  const [phase, setPhase] = useState<'intro' | 'chat'>('intro');
  const [input, setInput] = useState('');
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [stalledQuestion, setStalledQuestion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewer, setViewer] = useState<null | 'photo' | 'workflow' | 'post'>(null);
  const [jdMode, setJdMode] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState<{ question: string; answer: string } | null>(null);
  const quickTimerRef = useRef<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prefix = regionPathPrefix();
  const profileHref = `${prefix}/profile`;
  const whatsappHref = `https://wa.me/${RESUME_DATA.contact.phoneClean}?text=${encodeURIComponent(content.hero.whatsappMessage)}`;

  const flush = useCallback(() => {
    const target = iframeRef.current?.contentWindow;
    if (!readyRef.current || !pendingRef.current || !target) return;
    target.postMessage({ type: 'docmind:ask', prompt: pendingRef.current }, DOCMIND_ORIGIN);
    pendingRef.current = null;
    setStalledQuestion(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  // Listen before the iframe exists, so its first `ready` is never missed.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== DOCMIND_ORIGIN || event.source !== iframeRef.current?.contentWindow) return;
      if ((event.data as { type?: unknown } | null)?.type === 'docmind:ready') {
        readyRef.current = true;
        flush();
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [flush]);

  // Load DocMind quietly once the intro has had its moment, so the first
  // question does not also pay for the app starting up.
  useEffect(() => {
    const id = window.setTimeout(() => setFrameSrc((src) => src ?? buildDocMindUrl(region)), 2500);
    return () => window.clearTimeout(id);
  }, [region]);

  const ask = (raw: string) => {
    const typed = raw.trim();
    if (!typed) return;
    // A JD copied back from the fallback banner already carries the instruction;
    // strip every copy so it is sent exactly once.
    const hadPrompt = typed.includes(JD_PROMPT);
    const body = typed.split(JD_PROMPT).join('').trim();
    if (!body) return;
    const question = jdMode || hadPrompt ? `${JD_PROMPT}\n\n${body}` : typed;
    setJdMode(false);
    setInput('');

    const quick = QUICK_ANSWERS[typed];
    if (quickTimerRef.current) window.clearTimeout(quickTimerRef.current);
    setQuickAnswer(quick ? { question: typed, answer: quick } : null);
    if (quick) quickTimerRef.current = window.setTimeout(() => setQuickAnswer(null), 30000);

    pendingRef.current = question;
    setPhase('chat');
    // Mounted once and kept: a new src restarts DocMind and wipes the chat.
    if (!frameSrc) setFrameSrc(buildDocMindUrl(region));
    flush();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (pendingRef.current) setStalledQuestion(pendingRef.current);
    }, HANDOFF_TIMEOUT_MS);
  };

  const copyStalled = async () => {
    if (!stalledQuestion) return;
    try {
      await navigator.clipboard.writeText(stalledQuestion);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; the question is still on screen to select */
    }
  };

  // Escape closes the image viewer.
  useEffect(() => {
    if (!viewer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewer(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewer]);

  const startJobDescription = () => {
    setJdMode(true);
    textareaRef.current?.focus();
  };

  // Focus the composer on desktop only. On a phone it would open the keyboard
  // over the intro before the visitor has read anything.
  useEffect(() => {
    if (window.matchMedia?.('(pointer: fine)').matches) textareaRef.current?.focus();
  }, []);

  // Grow the composer with its text, up to a few lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 224)}px`;
  }, [input]);

  const badges = [content.hero.statusBadge, content.hero.visaBadge, `Notice ${RESUME_DATA.relocation.noticePeriod}`].filter(Boolean);

  return (
    // The intro scrolls with the page itself (an inner scroll box is unreliable on
    // phones); only the chat is pinned to the viewport, since the iframe fills it.
    <div className={`flex ${phase === 'chat' ? 'h-[100dvh]' : 'min-h-[100dvh]'} flex-col bg-[var(--bg-page)] text-[var(--text-body)] font-sans transition-colors duration-250`}>
      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 border-b theme-nav backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <button
            onClick={() => setPhase('intro')}
            className="group flex min-w-0 items-center gap-2 cursor-pointer text-left"
            aria-label="Home"
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#0052FF] to-[#00D2FF] p-0.5 shadow-md sm:h-9 sm:w-9">
              <img src="/kannan_avatar.jpg" alt="" className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold tracking-tight theme-title sm:text-base">{RESUME_DATA.name}</span>
              <span className="block truncate text-[9px] theme-muted sm:text-xs">{RESUME_DATA.title}</span>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {phase === 'chat' && (
              <button onClick={() => setPhase('intro')} className={textButton} title="Back to the start">
                <House className="h-3.5 w-3.5 theme-cyan-text" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
            <a href={profileHref} className={textButton}>
              <UserRound className="h-3.5 w-3.5 theme-cyan-text" />
              <span className="hidden sm:inline">Full profile</span>
            </a>
            <a href={content.resumePdf} download={content.resumePdf.split('/').pop()} className={textButton}>
              <Download className="h-3.5 w-3.5 theme-cyan-text" />
              <span className="hidden sm:inline">CV</span>
            </a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className={iconButton} title="WhatsApp" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noreferrer" className={`${iconButton} hidden sm:flex`} title="LinkedIn" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a
              href={RESUME_DATA.contact.calendly}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00D2FF] px-3 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg md:flex"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Book a Call</span>
            </a>
          </div>
        </div>
      </header>

      {/* Intro: typing headline, composer, suggestions */}
      <main className={`${phase === 'intro' ? 'flex' : 'hidden'} flex-1 flex-col items-center px-4 py-6 sm:py-8 xshort:py-3`}>
        {/* my-auto rather than justify-center: centred when it fits, and the page scrolls from the top when it does not */}
        <div className="my-auto w-full max-w-3xl">
          <div className="mb-4 flex justify-center sm:mb-5 short:mb-3 xshort:hidden">
            <button
              type="button"
              onClick={() => setViewer('photo')}
              aria-label="View photo"
              className="relative h-20 w-20 cursor-zoom-in rounded-full bg-gradient-to-br from-[#0052FF] via-[#7C3AED] to-[#00D2FF] p-[3px] shadow-lg shadow-[#0052FF]/20 transition-transform hover:scale-105 sm:h-24 sm:w-24 lg:h-[150px] lg:w-[150px] lg:p-1 lg:mid:h-32 lg:mid:w-32 short:h-16 short:w-16 sm:short:h-16 sm:short:w-16 lg:short:h-28 lg:short:w-28"
            >
              <img src="/kannan_avatar.jpg" alt={RESUME_DATA.name} className="h-full w-full rounded-full object-cover" />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-page)] bg-emerald-500 lg:bottom-2.5 lg:right-2.5 lg:h-5 lg:w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {badges.map((b, i) =>
              i === 0 ? (
                // The relocation badge leads, in the gold accent with a plane
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full theme-gold-badge px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-[11px]">
                  <Plane className="h-3 w-3" />
                  {b}
                </span>
              ) : (
                <span key={b} className="rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] px-2.5 py-1 text-[10px] font-medium theme-sub sm:px-3 sm:text-[11px]">
                  {b}
                </span>
              )
            )}
          </div>

          <div className="mt-5 sm:mt-7 short:mt-4 sm:short:mt-4">
            <TypedIntro />
          </div>

          {/* The composer is the focal point: a moving multi colour ring plus a
              soft glow behind it draw the eye here first. */}
          <div className="relative mt-8 sm:mt-24 sm:mid:mt-14 short:mt-6 sm:short:mt-10 xshort:mt-4">
            <div aria-hidden="true" className="composer-glow pointer-events-none absolute -inset-1.5 rounded-[26px]" />
            <form
              onSubmit={(e) => { e.preventDefault(); ask(input); }}
              className="composer-ring relative rounded-[22px] p-[2px] shadow-2xl"
            >
              <div className="flex flex-col gap-2 rounded-[20px] bg-[var(--bg-page)] p-3 sm:p-4">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  rows={2}
                  placeholder={jdMode ? 'Paste the job description here, then press send' : 'Ask about my work, my team or how I automate frontend development'}
                  aria-label={jdMode ? 'Job description' : 'Ask a question'}
                  className="max-h-56 min-h-[56px] sm:min-h-[72px] short:min-h-[44px] sm:short:min-h-[48px] w-full resize-none bg-transparent px-2 py-1.5 text-base theme-title outline-none placeholder:text-[var(--text-muted)] sm:text-lg"
                />
                {/* Quick actions inside the composer, like Claude's tool buttons */}
                <div className="flex items-center gap-2">
                  {jdMode && (
                    <button type="button" onClick={() => setJdMode(false)} className={`${composerAction} border-[var(--color-primary)] theme-title`}>
                      <span>Job description match</span>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <a href={content.resumePdf} download={content.resumePdf.split('/').pop()} className={composerAction}>
                    <Download className="h-3.5 w-3.5 theme-cyan-text" />
                    <span className="sm:hidden">CV</span>
                    <span className="hidden sm:inline">Download CV</span>
                  </a>
                  <a href={profileHref} className={composerAction}>
                    <UserRound className="h-3.5 w-3.5 theme-cyan-text" />
                    <span className="sm:hidden">Full profile</span>
                    <span className="hidden sm:inline">Go to full profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00D2FF] text-white shadow-md transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-default"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* The human way in, right where the eye already is */}
          <p className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-x-1.5 text-xs theme-muted short:mt-5">
            <span>Prefer to talk?</span>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-500 hover:underline">
              <WhatsAppIcon />
              WhatsApp me
            </a>
            <span>or</span>
            <a href={RESUME_DATA.contact.calendly} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold theme-cyan-text hover:underline">
              <CalendarClock className="h-3.5 w-3.5" />
              book a call
            </a>
          </p>

          {/* Kept small and set back so they support the composer rather than compete with it. */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-14 sm:mid:mt-8 short:mt-5 sm:short:mt-6">
            {[SUGGESTIONS[region][0], JD_CHIP, ...SUGGESTIONS[region].slice(1)].map((q, i) => (
              <button
                key={q}
                onClick={() => (q === JD_CHIP ? startJobDescription() : ask(q))}
                className={`rounded-full border px-3 py-1.5 text-[11px] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer sm:text-xs ${
                  i === 0 ? 'border-[var(--color-primary)]/60 theme-title' : q === JD_CHIP ? 'border-emerald-500/50 theme-sub' : 'border-[var(--border-card)] theme-muted'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Proof in numbers, plus the workflow diagram and the post behind it */}
          <div className="mt-8 flex flex-col items-center gap-3 short:mt-5">
            <p className="text-[11px] font-medium tracking-wide theme-muted">10.5+ years · SuperOps · Freshworks</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {PROOF.map((p) => (
                <div key={p.value} className="text-center">
                  <div className="text-sm font-bold theme-cyan-text sm:text-base">{p.value}</div>
                  <div className="text-[10px] theme-muted sm:text-[11px]">{p.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setViewer('workflow')} className={composerAction}>
                <Workflow className="h-3.5 w-3.5 theme-cyan-text" />
                <span>See the automation workflow</span>
              </button>
              <button type="button" onClick={() => setViewer('post')} className={composerAction}>
                <LinkedInIcon />
                <span>Read my LinkedIn post</span>
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] theme-muted short:mt-3">
            Answers are AI generated from my resume and project notes, with sources cited.
          </p>
        </div>
      </main>

      {/* Chat: DocMind, mounted on the first question and kept alive after */}
      <section className={`${phase === 'chat' ? 'flex' : 'hidden'} relative flex-1 flex-col`}>
        {quickAnswer && !stalledQuestion && (
          <div className="absolute inset-x-3 top-3 z-10 mx-auto max-w-2xl rounded-xl border border-[var(--color-primary)]/40 bg-[var(--bg-card)] px-4 py-3 text-xs shadow-lg sm:text-sm">
            <div className="flex items-start gap-3">
              <img src="/kannan_avatar.jpg" alt="" className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider theme-cyan-text">Quick answer · the full answer with sources is loading below</p>
                <p className="mt-1 leading-relaxed theme-sub">{quickAnswer.answer}</p>
              </div>
              <button onClick={() => setQuickAnswer(null)} aria-label="Close quick answer" className="theme-muted hover:theme-title cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {stalledQuestion && (
          <div className="absolute inset-x-3 top-3 z-10 mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-amber-500/40 bg-[var(--bg-card)] px-4 py-3 text-xs shadow-lg sm:text-sm">
            <span className="flex-1 theme-sub">
              Your question did not carry over. Paste it into the chat below.
              <span className="mt-1 block font-semibold theme-title">{stalledQuestion}</span>
            </span>
            <button onClick={copyStalled} className={textButton}>
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
        {frameSrc && (
          <iframe
            ref={iframeRef}
            src={frameSrc}
            title="Chat with Kannan's AI assistant"
            className="h-full w-full flex-1 border-0"
            allow="clipboard-write"
          />
        )}
      </section>

      {/* Image viewer: the profile photo or the automation workflow diagram */}
      {viewer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={viewer === 'photo' ? `Photo of ${RESUME_DATA.name}` : viewer === 'post' ? 'LinkedIn post' : 'Automated frontend workflow'}
          onClick={() => setViewer(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setViewer(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          {viewer === 'post' && isPhone() ? (
            // Phones get a native card: LinkedIn's embed often loads blank in
            // mobile Safari, which blocks its cookies inside another site.
            <div onClick={(e) => e.stopPropagation()} className="max-h-[85dvh] w-full max-w-[504px] overflow-y-auto rounded-2xl bg-white text-[#191919] shadow-2xl cursor-default">
              <div className="flex items-center gap-3 p-4">
                <img src="/kannan_avatar.jpg" alt="" className="h-11 w-11 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Kannan Santharam</p>
                  <p className="text-xs text-[#666]">Post on LinkedIn</p>
                </div>
                <LinkedInIcon />
              </div>
              <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed">
                {POST_EXCERPT.map((para) => <p key={para}>{para}</p>)}
              </div>
              <img src="/frontend_automation_workflow.jpg" alt="Automated frontend workflow diagram" className="w-full border-y border-[#e5e5e5]" />
              <a
                href={LINKEDIN_POST_URL}
                target="_blank"
                rel="noreferrer"
                className="m-4 flex items-center justify-center gap-1.5 rounded-full bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Read the full post on LinkedIn <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : viewer === 'post' ? (
            <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[504px] flex-col items-center gap-3 cursor-default">
              <iframe
                src={LINKEDIN_POST_EMBED}
                title="LinkedIn post about automating frontend development"
                className="h-[min(544px,75dvh)] w-full rounded-2xl bg-white shadow-2xl"
                allowFullScreen
              />
              <a href={LINKEDIN_POST_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white">
                Open on LinkedIn <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
          <img
            src={viewer === 'photo' ? '/kannan_photo.jpg' : '/frontend_automation_workflow.jpg'}
            alt={viewer === 'photo' ? RESUME_DATA.name : 'Automated frontend workflow, from design input and API contract through Claude agents and strict guardrails to tested, production ready code'}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[85dvh] max-w-full rounded-2xl object-contain shadow-2xl cursor-default ${viewer === 'workflow' ? 'bg-white' : ''}`}
          />
          )}
        </div>
      )}
    </div>
  );
};
