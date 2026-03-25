import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm Suraj's portfolio assistant. Ask me anything about his work, skills, or how to get in touch!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(trimmed, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process that. Please try the contact form instead!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent-500 to-indigo-600 text-white shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 flex items-center justify-center transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
        id="chatbot-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-700 flex flex-col overflow-hidden bg-white dark:bg-dark-800"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-accent-500 to-indigo-600 text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                <p className="text-xs text-white/80">Powered by AI</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' 
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent-500 text-white rounded-br-md'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-bl-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Bot size={12} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-dark-700">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-dark-700">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-dark-700 text-sm text-slate-700 dark:text-slate-200 border-0 outline-none focus:ring-2 focus:ring-accent-500/50 placeholder-slate-400"
                  disabled={isTyping}
                  id="chatbot-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full bg-accent-500 text-white flex items-center justify-center transition-all hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="chatbot-send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
