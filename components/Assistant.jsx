import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, RotateCcw, ExternalLink } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { projects as defaultProjects } from '../services/projectsData';
import { projectsService } from '../services/projectsService';

const SUGGESTIONS = [
  "🚀 Need a high-performance website",
  "💼 Show me Haroon's top projects",
  "⚡ How do you achieve < 0.8s load speed?",
  "💰 What is the pricing & timeline?",
  "💬 Connect with Haroon on WhatsApp"
];

// Helper to parse bold (**text**) and markdown links ([text](url)) within a line
const parseInlineMarkdown = (text) => {
  if (!text) return null;

  // Regex matches markdown links [text](url) or bold **text**
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Markdown link
      const linkText = match[2];
      const linkUrl = match[3];
      const isWhatsApp = linkUrl.includes('whatsapp.com');

      if (isWhatsApp) {
        elements.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 my-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-950/40 hover:scale-[1.02] active:scale-95 transition-all justify-center text-center tracking-wide"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.155.941 11.524.941 6.087.941 1.662 5.31 1.658 10.74c-.001 1.758.462 3.476 1.343 4.996l-.985 3.598 3.7.969-.17-.11zM16.73 13.9c-.287-.144-1.7-.84-1.964-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-.288-.144-1.216-.448-2.316-1.432-.856-.764-1.432-1.708-1.6-2-.168-.288-.018-.444.126-.588.13-.13.287-.336.43-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.233-.56-.47-.483-.648-.492-.168-.009-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.032 3.102 4.921 4.35.687.297 1.224.474 1.643.607.69.219 1.32.188 1.817.114.553-.082 1.7-.696 1.942-1.368.242-.672.242-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
            </svg>
            <span>{linkText}</span>
          </a>
        );
      } else {
        elements.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors mx-0.5"
          >
            <span>{linkText}</span>
            <ExternalLink size={12} className="opacity-75" />
          </a>
        );
      }
    } else if (match[4]) {
      // Bold text
      elements.push(
        <strong key={match.index} className="font-semibold text-white">
          {match[4]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
};

const renderMessageContent = (content) => {
  const lines = (content || '').split('\n');

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={lineIdx} className="h-1.5" />;

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1.5 my-1">
              <span className="text-indigo-400 mt-1 select-none text-[10px]">●</span>
              <div className="flex-1">{parseInlineMarkdown(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered list (e.g. "1. ")
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1.5 my-1">
              <span className="text-indigo-400 font-bold select-none text-xs">{numberedMatch[1]}.</span>
              <div className="flex-1">{parseInlineMarkdown(numberedMatch[2])}</div>
            </div>
          );
        }

        return <div key={lineIdx}>{parseInlineMarkdown(line)}</div>;
      })}
    </div>
  );
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi there! 👋 I'm Haroon's representative.\n\nHaroon is a web developer specializing in ultra-fast React websites, conversion-driven web apps, and modern MERN stack solutions.\n\nWhether you need a new website built, an existing store optimized for sales, or want to explore ideas, I'm here to help! What kind of project are you looking to launch?"
};

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProjects, setActiveProjects] = useState(defaultProjects);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Keep active projects strictly synchronized with the projects section and any future updates
    const unsubscribe = projectsService.subscribeProjects((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setActiveProjects(list);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customPrompt) => {
    const promptToSend = (typeof customPrompt === 'string' ? customPrompt : input).trim();
    if (!promptToSend || isLoading) return;

    const userMessage = { role: 'user', content: promptToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the conversation history AND the live active projects from the projects section
      const response = await chatWithAssistant(promptToSend, messages, activeProjects);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error("Error communicating with assistant:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having a momentary hiccup connecting with the server. Feel free to connect directly with Haroon on WhatsApp: [Chat on WhatsApp](https://api.whatsapp.com/send?phone=923214576734&text=Hi%20Haroon%2C%20I%20would%20like%20to%20discuss%20a%20project.)"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] h-[550px] max-h-[85vh] bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 flex items-center justify-between border-b border-indigo-500/30">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                    <Bot size={20} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-700 rounded-full" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">Haroon's Bot</h4>
                  <p className="text-emerald-300 text-[10px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={resetConversation}
                  title="Restart Conversation"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3.5 bg-gradient-to-b from-[#0b1120] to-[#0f172a]"
              ref={scrollRef}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-950/40'
                        : 'bg-slate-800/90 text-slate-200 rounded-bl-sm border border-white/5 shadow-md shadow-slate-950/40'
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/90 border border-white/5 p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Haroon's Bot is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.18s]" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.36s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-3 pt-2 pb-1 bg-[#0b1120] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="shrink-0 text-[11px] bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition-all text-left whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-slate-900 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about projects, pricing, speed, or hiring..."
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-950/50"
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                <span>Want to talk directly?</span>
                <a
                  href="https://api.whatsapp.com/send?phone=923214576734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  WhatsApp Haroon directly
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat Assistant"
        className="relative w-14 h-14 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-950/60 hover:shadow-indigo-600/40 transition-shadow border border-white/20"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0f172a]" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default Assistant;

