
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

const renderMessageContent = (content) => {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const lines = content.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        if (line.trim() === '') return <div key={lineIdx} className="h-2" />;
        
        const elements = [];
        let lastIndex = 0;
        let match;
        
        mdLinkRegex.lastIndex = 0;
        
        while ((match = mdLinkRegex.exec(line)) !== null) {
          const textBefore = line.substring(lastIndex, match.index);
          const linkText = match[1];
          const linkUrl = match[2];
          
          if (textBefore) {
            elements.push(<span key={lastIndex}>{textBefore}</span>);
          }
          
          const isWhatsApp = linkUrl.includes('whatsapp.com');
          if (isWhatsApp) {
            elements.push(
              <a
                key={match.index}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 my-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-95 transition-all w-full justify-center text-center tracking-wide"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.155.941 11.524.941 6.087.941 1.662 5.31 1.658 10.74c-.001 1.758.462 3.476 1.343 4.996l-.985 3.598 3.7.969-.17-.11zM16.73 13.9c-.287-.144-1.7-.84-1.964-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-.288-.144-1.216-.448-2.316-1.432-.856-.764-1.432-1.708-1.6-2-.168-.288-.018-.444.126-.588.13-.13.287-.336.43-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.233-.56-.47-.483-.648-.492-.168-.009-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.032 3.102 4.921 4.35.687.297 1.224.474 1.643.607.69.219 1.32.188 1.817.114.553-.082 1.7-.696 1.942-1.368.242-.672.242-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
                </svg>
                {linkText}
              </a>
            );
          } else {
            elements.push(
              <a
                key={match.index}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline font-semibold transition-colors"
              >
                {linkText}
              </a>
            );
          }
          
          lastIndex = mdLinkRegex.lastIndex;
        }
        
        const textAfter = line.substring(lastIndex);
        if (textAfter) {
          elements.push(<span key="end">{textAfter}</span>);
        }
        
        return <div key={lineIdx} className="leading-relaxed">{elements}</div>;
      })}
    </div>
  );
};

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Haroon's AI Representative. I help businesses build lightning-fast, ultra-optimized, high-conversion websites.\nTo discuss your project requirements and get a free custom proposal directly from Haroon within minutes, connect with us right now:\n[Chat on WhatsApp to Start Your Project](https://api.whatsapp.com/send?phone=923214576734&text=Hey%2C%20I%20am%20looking%20to%20develop%20a%20high-performance%20website%20for%20my%20business.%20Let's%20connect%20to%20discuss%20our%20project%20requirements%20and%20timeline.)" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error("Error sending message to assistant:", err);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "I'm having trouble connecting to Haroon's brain right now. Please try again later!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-[350px] md:w-[400px] h-[500px] bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Haroon's Bot</h4>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 bg-slate-900/40" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-300 rounded-bl-none'
                  }`}>
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me about Haroon..."
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-500 hover:scale-110 transition-all active:scale-95"
      >
        {isOpen ? <X /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default Assistant;
