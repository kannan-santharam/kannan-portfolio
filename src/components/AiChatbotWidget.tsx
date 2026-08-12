import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { streamRealLlmApi, getEnvApiKey } from '../services/aiChatService';
import type { ChatMessage } from '../services/aiChatService';

// Lightweight Markdown Formatter to render bold (**), bullet points, and code cleanly without raw asterisks
const FormattedMarkdownText: React.FC<{ content: string }> = ({ content }) => {
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

              // Parse bold **text**
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
              const formattedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="font-extrabold text-[var(--text-title)]">{part.slice(2, -2)}</strong>;
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
    </div>
  );
};

export const AiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasEnvKey = !!getEnvApiKey();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! 👋 I am **Kannan Appiya Santharam's AI Assistant**.\n\nAsk me anything about Kannan's **10.5+ years of experience**, **96% Rspack build acceleration**, **AI test-authoring platform**, **HTTP Streamable Web Streams**, **Claude Code & MCP servers**, or **Dubai relocation readiness**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealLlm: hasEnvKey
    }
  ]);

  const promptSuggestions = [
    "⚡ How did Kannan cut build times by 96%?",
    "🌊 How does the HTTP Streamable architecture work?",
    "🇦🇪 What is Kannan's Dubai relocation & visa status?",
    "🛡️ How do Claude Code skills & MCP servers work?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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

    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '▌',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRealLlm: hasEnvKey
    };

    setMessages(prev => [...prev, initialAiMsg]);

    try {
      await streamRealLlmApi(query, (accumulatedText, isRealLlmChunk) => {
        setMessages(prev =>
          prev.map(m => (m.id === aiMsgId ? { ...m, text: accumulatedText, isRealLlm: isRealLlmChunk } : m))
        );
      });
    } catch (err) {
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
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Chat history reset. How can I assist you with **Kannan Appiya Santharam's** qualifications and Dubai availability?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button with Sleek Refined Color Border */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center overflow-hidden rounded-full p-[1.75px] transition-transform duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open AI Candidate Assistant"
          >
            {/* Fast Rotating Conic Color Gradient Border */}
            <span className="absolute inset-[-150%] animate-spin-border bg-[conic-gradient(from_0deg,#E2B755_0%,#00F2FE_25%,#A855F7_50%,#34D399_75%,#E2B755_100%)]" />

            {/* Inner Button Content */}
            <div className="relative flex items-center gap-2.5 rounded-full bg-[#07090E] px-4 py-3 text-slate-100 font-bold">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#141C2E] text-[#E2B755]">
                <Bot className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07090E]" />
              </div>
              <span className="text-xs font-extrabold sm:text-sm text-white">Ask Candidate AI</span>
              <Sparkles className="h-3.5 w-3.5 text-[#E2B755] group-hover:rotate-12 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[560px] max-h-[85vh] w-[94vw] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-body)] shadow-2xl backdrop-blur-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-page)]/95 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/kannanphoto.jpeg"
                  alt="Kannan"
                  className="h-9 w-9 rounded-full object-cover object-top border border-[var(--border-gold)] shadow-md"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07090E]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold theme-title">Kannan's AI Assistant</span>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" />
                    <span>HTTP Streamable</span>
                  </span>
                </div>
                <p className="text-[10px] theme-muted">Gemini Stream Engine (ReadableStream)</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="rounded-lg p-1.5 theme-sub hover:bg-[var(--bg-card-hover)] cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#E2B755] to-[#C29633] text-[#07090E] font-semibold rounded-br-none shadow-md'
                      : 'border border-[var(--border-card)] bg-[var(--bg-inner)] theme-title rounded-bl-none shadow-sm'
                  }`}
                >
                  <FormattedMarkdownText content={msg.text} />
                </div>
                <div className="mt-1 flex items-center gap-1.5 px-1 text-[9px] theme-muted">
                  <span>{msg.timestamp}</span>
                  {msg.isRealLlm && (
                    <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-500">
                      Gemini HTTP Stream
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.text === '▌' && (
              <div className="flex items-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-inner)] px-3 py-2 text-xs theme-sub">
                  <Bot className="h-3.5 w-3.5 theme-gold-text animate-spin" />
                  <span className="text-[11px]">Connecting HTTP Streamable...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-[var(--border-card)] bg-[var(--bg-page)]/95 p-2.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Kannan's experience, Rspack, or HTTP Streamable..."
              className="flex-1 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 text-xs theme-title outline-none focus:border-[var(--color-gold)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#E2B755] to-[#C29633] text-[#07090E] disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
