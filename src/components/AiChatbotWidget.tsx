import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, Zap, MessageSquare } from 'lucide-react';
import { streamRealLlmApi, getEnvApiKey } from '../services/aiChatService';
import type { ChatMessage, ConversationTurn } from '../services/aiChatService';
import { RESUME_DATA } from '../data/resumeData';

// Streaming-aware Markdown Formatter: handles split bold tags and lists smoothly
const FormattedMarkdownText: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming }) => {
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-2 leading-relaxed text-xs">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
              const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : line;

              // Parse bold **text** safely even during live incomplete chunks
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
              const formattedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                  return <strong key={i} className="font-extrabold text-[var(--text-title)]">{part.slice(2, -2)}</strong>;
                }
                // If a bold tag is currently opened mid-stream without a closing **
                if (part.startsWith('**') && !part.slice(2).includes('**')) {
                  return <span key={i} className="font-bold text-[var(--text-title)]">{part.slice(2)}</span>;
                }
                return part;
              });

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 pl-1 my-0.5">
                    <span className="text-[var(--color-gold)] font-bold shrink-0">•</span>
                    <span>{formattedLine}</span>
                  </div>
                );
              }

              return <p key={lIdx}>{formattedLine}</p>;
            })}
          </div>
        );
      })}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3 ml-0.5 bg-[var(--color-gold)] rounded-sm animate-pulse align-middle" />
      )}
    </div>
  );
};

interface AiChatbotWidgetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AiChatbotWidget: React.FC<AiChatbotWidgetProps> = ({ isOpen, onOpenChange }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasEnvKey = !!getEnvApiKey();
  const abortControllerRef = useRef<AbortController | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Conversation history for multi-turn LLM context (sent to /api/chat on each request)
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);

  // Cleanup on unmount: abort any in-flight fetch and cancel pending animation frames
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! 👋 I'm **Kannan's AI Career Assistant**.\n\nAsk me anything — his **10.5+ years of experience**, **Agentic AI & MCP servers**, the **96% build speed win**, or **Dubai relocation readiness**.\n\nI remember the conversation, so feel free to ask follow-up questions too!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealLlm: hasEnvKey
    }
  ]);

  const promptSuggestions = [
    "🤖 What is Kannan's experience with Agentic AI, MCP servers, and Playwright?",
    "🛠️ What is Kannan's AI Test-Authoring Platform?",
    "🇦🇪 What is Kannan's Dubai relocation & visa status?",
    "💼 What are Kannan's salary expectations?",
    "⚡ How did Kannan cut build times by 96%?"
  ];

  // Pinned scroll-to-bottom that keeps scroll anchored without jumping
  const scrollToBottom = (smooth = false) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    if (smooth) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    setTimeout(() => scrollToBottom(true), 50);

    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealLlm: hasEnvKey
    };

    setMessages(prev => [...prev, initialAiMsg]);

    let finalResponse = '';
    let pendingText = '';

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await streamRealLlmApi(
        query,
        conversationHistory,
        (accumulatedText, isRealLlmChunk) => {
          finalResponse = accumulatedText;
          pendingText = accumulatedText;

          // Batch DOM updates via requestAnimationFrame to avoid micro-stutters
          if (!rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(() => {
              setMessages(prev =>
                prev.map(m => (m.id === aiMsgId ? { ...m, text: pendingText, isRealLlm: isRealLlmChunk } : m))
              );
              scrollToBottom(false);
              rafIdRef.current = null;
            });
          }
        },
        controller.signal
      );

      // Flush final text
      if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
      setMessages(prev =>
        prev.map(m => (m.id === aiMsgId ? { ...m, text: finalResponse, isRealLlm: result.isRealLlm } : m))
      );

      // Cap client-side history to last 8 turns + new exchange = max 10 sent to server
      setConversationHistory(prev => [
        ...prev.slice(-8),
        { role: 'user', text: query },
        { role: 'model', text: finalResponse || '...' }
      ]);

    } catch (err: any) {
      if (err?.name === 'AbortError') return; // Clean exit on user clear or component unmount
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId
            ? {
                ...m,
                text: "I encountered a temporary issue. Please feel free to ask again or contact Kannan directly at as.kannan4@gmail.com."
              }
            : m
        )
      );
    } finally {
      if (rafIdRef.current) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
      abortControllerRef.current = null;
      setIsLoading(false);
      setIsStreaming(false);
      scrollToBottom(false);
    }
  };

  const handleClearHistory = () => {
    // Instantly abort any active stream before clearing state
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
    setConversationHistory([]);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Chat cleared! Fresh start. 🚀\n\nWhat would you like to know about **Kannan Appiya Santharam**? His experience, AI work, skills, or Dubai availability?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button with Sleek Refined Color Border */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
          <button
            onClick={() => onOpenChange(true)}
            className="group relative flex items-center justify-center overflow-hidden rounded-full p-[1.75px] transition-transform duration-300 hover:scale-105 cursor-pointer shadow-2xl"
            aria-label="Open AI Candidate Assistant"
          >
            {/* Fast Rotating Conic Color Gradient Border */}
            <span className="absolute inset-[-150%] animate-spin-border bg-[conic-gradient(from_0deg,#E2B755_0%,#00F2FE_25%,#A855F7_50%,#34D399_75%,#E2B755_100%)]" />

            {/* Inner Button Content */}
            <div className="relative flex items-center gap-2.5 rounded-full bg-[#07090E] px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-100 font-bold">
              <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#141C2E] text-[#E2B755]">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07090E]" />
              </div>
              <span className="text-xs font-extrabold sm:text-sm text-white">Ask Candidate AI</span>
              <Sparkles className="h-3.5 w-3.5 text-[#E2B755] group-hover:rotate-12 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex h-[540px] max-h-[92vh] w-[95vw] sm:w-[420px] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-body)] shadow-2xl backdrop-blur-2xl transition-all">
          
          {/* Clean Non-Overlapping Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-page)]/95 px-3 py-2.5 sm:px-4 sm:py-3 gap-2">
            
            {/* Left Profile Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/kannanphoto.jpeg"
                  alt="Kannan"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover object-top border border-[var(--border-gold)] shadow-md"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07090E]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-extrabold theme-title truncate">
                  Kannan's AI Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] theme-muted mt-0.5">
                  <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-emerald-800 dark:text-emerald-400 shrink-0">
                    <Zap className="h-2.5 w-2.5" />
                    <span>HTTP Streamable</span>
                  </span>
                </div>
                <p className="text-[10px] theme-muted truncate">· Gemini Flash</p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`https://wa.me/${RESUME_DATA.contact.phoneClean}?text=Hi%20Kannan,%20I'm%20chatting%20with%20your%20AI%20Portfolio%20Assistant%20and%20would%20like%20to%20connect%20regarding%20a%20role%20in%20Dubai.`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-2 py-1 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-bold flex items-center gap-1 transition-all"
                title="Direct WhatsApp"
              >
                <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={handleClearHistory}
                className="rounded-lg p-1.5 theme-sub hover:bg-[var(--bg-card-hover)] cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 theme-sub hover:bg-[var(--bg-card-hover)] cursor-pointer"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Prompt Suggestions Strip */}
          <div className="border-b border-[var(--border-card)] bg-[var(--bg-inner)] p-2 overflow-x-auto no-scrollbar flex gap-1.5">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-2.5 py-1 text-[10px] font-medium theme-title transition-all hover:border-[var(--color-gold)] hover:bg-[var(--bg-card-hover)] cursor-pointer shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream Body */}
          <div
            ref={messagesContainerRef}
            className="relative flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 font-sans text-xs scroll-smooth"
          >
            {/* Gemini Ambient Backdrop Glow while Thinking / Streaming */}
            {isLoading && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-500/15 via-blue-500/10 to-transparent gemini-ambient-glow" />
            )}

            {messages.map((msg) => {
              if (msg.sender === 'ai' && !msg.text && isLoading) {
                // Initial thinking state before first token arrives
                return null;
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[88%] rounded-2xl p-3 leading-relaxed transition-opacity duration-150 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#E2B755] to-[#C29633] text-[#07090E] font-semibold rounded-br-none shadow-md'
                        : 'border border-[var(--border-card)] bg-[var(--bg-inner)] theme-title rounded-bl-none shadow-sm'
                    }`}
                  >
                    <FormattedMarkdownText
                      content={msg.text}
                      isStreaming={isStreaming && msg.sender === 'ai' && msg.id === messages[messages.length - 1]?.id}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 px-1 text-[9px] theme-muted">
                    <span>{msg.timestamp}</span>
                    {msg.isRealLlm && (
                      <span className="rounded bg-emerald-100 dark:bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-800 dark:text-emerald-400">
                        Gemini HTTP Stream
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Gemini Multi-color Gradient Shimmer Loading State (only shown before first token) */}
            {isLoading && messages[messages.length - 1]?.sender === 'ai' && !messages[messages.length - 1]?.text && (
              <div className="flex items-start my-1.5">
                <div className="relative overflow-hidden rounded-2xl p-[1.5px] shadow-lg w-full max-w-[90%]">
                  {/* Animated Gemini Multi-color Gradient Border */}
                  <div className="absolute inset-0 gemini-gradient-bg opacity-95" />

                  {/* Inner Shimmer Loading Card */}
                  <div className="relative flex items-center justify-between rounded-[14px] bg-[var(--bg-inner)] px-3.5 py-2.5 theme-title">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full gemini-gradient-bg text-white shadow-md">
                        <Sparkles className="h-3.5 w-3.5 animate-spin" />
                      </div>
                      <span className="gemini-gradient-text text-xs font-extrabold tracking-wide truncate">
                        Gemini Flash Stream Engine...
                      </span>
                    </div>

                    {/* Pulse Dot Indicator */}
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                      <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: '200ms' }} />
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-[var(--border-card)] bg-[var(--bg-page)]/95 p-2 sm:p-2.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Kannan's experience, Rspack..."
              className="flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-xs theme-title outline-none focus:border-[var(--color-gold)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#E2B755] to-[#C29633] text-[#07090E] disabled:opacity-50 cursor-pointer shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
