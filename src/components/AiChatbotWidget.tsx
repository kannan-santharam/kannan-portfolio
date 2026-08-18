import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { streamRealLlmApi, getEnvApiKey } from '../services/aiChatService';
import type { ChatMessage, ConversationTurn } from '../services/aiChatService';

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
            <span className="absolute inset-[-150%] animate-spin-border bg-[conic-gradient(from_0deg,#0052FF_0%,#00D2FF_25%,#7C3AED_50%,#00E599_75%,#0052FF_100%)]" />

            {/* Inner Button Content */}
            <div className="relative flex items-center gap-2.5 rounded-full bg-[#0B0E14] px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-100 font-bold">
              <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#182030] text-[#00D2FF]">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0E14]" />
              </div>
              <span className="text-xs font-extrabold sm:text-sm text-white">Ask Candidate AI</span>
              <Sparkles className="h-3.5 w-3.5 text-[#00D2FF] group-hover:rotate-12 transition-transform" />
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
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0052FF]/15 text-[#38BDF8]">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--bg-page)]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold theme-title truncate">Candidate AI</h3>
                  <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-primary)] font-semibold truncate">
                  10.5+ Yrs · Rspack · AI Test Platform
                </p>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleClearHistory}
                className="rounded-lg p-1.5 text-xs theme-sub hover:bg-[var(--bg-card-hover)] hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear Conversation"
                aria-label="Clear chat history"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 theme-sub hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-title)] transition-colors cursor-pointer"
                title="Minimize Chat"
                aria-label="Close chat window"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
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
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed break-words shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white rounded-br-none'
                        : 'bg-[var(--bg-inner)] border border-[var(--border-card)] theme-title rounded-bl-none'
                    }`}
                  >
                    <FormattedMarkdownText
                      content={msg.text}
                      isStreaming={isStreaming && msg.sender === 'ai' && msg.id === messages[messages.length - 1]?.id}
                    />
                  </div>
                  <span className="text-[9px] theme-muted mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Suggested Prompt Chips (Shown only when history is clean) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider theme-muted">Suggested Queries</div>
                <div className="flex flex-col gap-1.5">
                  {promptSuggestions.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-2 text-left text-xs theme-sub hover:border-[var(--color-primary)] hover:text-[var(--text-title)] transition-all cursor-pointer shadow-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shimmering Multi-Color Gemini Loading Card */}
            {isLoading && messages[messages.length - 1]?.sender === 'ai' && !messages[messages.length - 1]?.text && (
              <div className="flex items-start gap-2 pt-1 animate-fadeIn">
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
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '400ms' }} />
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
              className="flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-xs theme-title outline-none focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#0052FF] to-[#00D2FF] text-white disabled:opacity-50 cursor-pointer shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
