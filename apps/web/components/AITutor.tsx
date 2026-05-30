"use client";

import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, X, Sparkles, Minimize2, RotateCcw, ChevronDown, Lock, PlayCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { logTelemetry } from '../app/actions';

const QUICK_PROMPTS = [
  "Explain Le Chatelier's Principle",
  "Help me with integration by parts",
  "What is photoelectric effect?",
  "How do I solve quadratic inequalities?",
  "Explain DNA replication",
  "What are transition metal properties?",
];

/** Extract text from a UIMessage's parts array (AI SDK v5+) */
function getMessageText(message: { content?: string; parts?: Array<{ type: string; text?: string }> }): string {
  // AI SDK v5+ uses parts
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text ?? '')
      .join('');
  }
  // Fallback for older SDK or plain content
  if (typeof message.content === 'string') return message.content;
  return '';
}

export default function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [simulatingAd, setSimulatingAd] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
  } = useChat({
    api: '/api/chat',
  });
  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    // Check unlock status on mount
    const unlocked = document.cookie.includes("ai_tutor_unlocked=true");
    setIsUnlocked(unlocked);
  }, []);

  const handleUnlock = () => {
    setSimulatingAd(true);
    // Simulate watching a 3-second rewarded ad
    setTimeout(() => {
      document.cookie = "ai_tutor_unlocked=true; path=/; max-age=" + (60 * 60 * 24);
      setIsUnlocked(true);
      setSimulatingAd(false);
      // Let's also log telemetry for this event
      logTelemetry('ai_tutor_unlocked', 'Reward Ad Watched');
    }, 3000);
  };

  useEffect(() => {
    if (error) {
      console.error('AI Tutor error:', error);
    }
  }, [error]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || !isUnlocked) return;
    sendMessage({ text: input });
    logTelemetry('ai_tutor_query', input);
    setInput('');
    // Reset textarea height to original
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.style.height = 'auto';
  };

  const sendQuickPrompt = (prompt: string) => {
    if (!isUnlocked) return;
    sendMessage({ text: prompt });
    logTelemetry('ai_tutor_query', prompt);
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 group"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 lg:bottom-6 right-0 lg:right-6 w-full lg:w-96 bg-card border shadow-2xl rounded-t-3xl lg:rounded-3xl flex flex-col overflow-hidden z-[60]"
            style={{ height: isMinimized ? 'auto' : '80vh', maxHeight: isMinimized ? 'auto' : '600px' }}
          >
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Tutor</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {isLoading ? 'Thinking...' : 'Online · DeepSeek'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <Lock className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Unlock AI Tutor</h4>
                      <p className="text-sm text-muted-foreground mb-6">
                        Support PaperDrill by watching a short ad to unlock unlimited AI Tutor access for 24 hours.
                      </p>
                      <button
                        onClick={handleUnlock}
                        disabled={simulatingAd}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold transition-all hover:bg-primary/90 disabled:opacity-70"
                      >
                        {simulatingAd ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Playing Ad...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-5 h-5" />
                            Watch Ad to Unlock
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {messages.length === 0 ? (
                    <div className={`flex flex-col gap-4 h-full ${!isUnlocked ? 'blur-sm' : ''}`}>
                      <div className="flex flex-col items-center text-center p-4 gap-3 mt-4">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-primary/40" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">How can I help you today?</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            I can explain concepts, work through problems step-by-step, and help you understand CAIE, Edexcel, IB, AQA & Dhaka Board papers.
                          </p>
                        </div>
                      </div>
                      {/* Quick prompts */}
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Quick questions</p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {QUICK_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => sendQuickPrompt(prompt)}
                              className="text-left text-xs px-3 py-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors text-foreground font-medium border border-transparent hover:border-primary/20"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted/60 border rounded-tl-sm'
                        }`}>
                          {getMessageText(m as any)}
                        </div>
                        {m.role === 'user' && (
                          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted/60 border px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  id="ai-tutor-form"
                  onSubmit={handleFormSubmit}
                  className="p-3 border-t bg-muted/10 shrink-0 pb-safe"
                >
                  <div className="relative flex items-end gap-2">
                    <textarea
                      value={input}
                      disabled={!isUnlocked}
                      onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleFormSubmit();
                        }
                      }}
                      placeholder={isUnlocked ? "Ask anything... (Enter to send)" : "Unlock AI Tutor to ask questions..."}
                      rows={1}
                      className="flex-1 bg-background border rounded-2xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[42px] max-h-[120px] disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input?.trim() || isLoading || !isUnlocked}
                      className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Shift+Enter for new line · AI may make mistakes
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
