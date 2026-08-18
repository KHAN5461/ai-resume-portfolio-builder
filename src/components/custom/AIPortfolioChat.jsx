import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBlock } from '@/store/portfolioSlice';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIPortfolioChat = ({ portfolioId }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hi! I'm your AI Portfolio Assistant. How can I help you build your portfolio today?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    const userText = text || input;
    if (!userText.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now(), role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response and intent parsing
    setTimeout(() => {
      let aiResponse = "I'm not sure how to do that yet.";
      const lowerInput = userText.toLowerCase();

      if (lowerInput.includes('contact')) {
        aiResponse = "Adding a contact section...";
        dispatch(addBlock({ portfolioId, blockType: 'contact', blockName: 'Contact' }));
      } else if (lowerInput.includes('about')) {
        aiResponse = "Adding an about section...";
        dispatch(addBlock({ portfolioId, blockType: 'about', blockName: 'About' }));
      } else if (lowerInput.includes('project')) {
        aiResponse = "Adding a projects section...";
        dispatch(addBlock({ portfolioId, blockType: 'projects', blockName: 'Projects' }));
      } else if (lowerInput.includes('skill')) {
        aiResponse = "Adding a skills section...";
        dispatch(addBlock({ portfolioId, blockType: 'skills', blockName: 'Skills' }));
      } else if (lowerInput.includes('dark')) {
        aiResponse = "Switching to dark mode (simulated)...";
        // Assuming we'd dispatch a theme change here
      } else {
        aiResponse = "I can help you build sections like 'About', 'Projects', 'Skills', or 'Contact'. Try asking me to add one of those!";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiResponse }]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Add a Contact section",
    "Add an About section",
    "Add a Projects section",
    "Switch to Dark Mode"
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-surface to-surface-container-lowest border-r border-outline-variant/20 shadow-sm relative z-10">
      {/* Header */}
      <div className="p-5 border-b border-outline-variant/20 flex items-center gap-3 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stitch-primary to-stitch-secondary flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-headline-sm font-bold text-on-surface leading-tight">Sparkfolio AI</h2>
          <p className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wider">Design Assistant</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-surface border border-outline-variant/30' : 'bg-gradient-to-br from-stitch-primary to-stitch-secondary'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-on-surface-variant" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-surface border border-outline-variant/20 text-on-surface rounded-tr-sm' : 'bg-stitch-primary text-white rounded-tl-sm'}`}>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 shrink-0">
        {/* Quick Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant/30 bg-surface hover:bg-surface-container hover:border-stitch-primary/30 text-[13px] font-medium text-on-surface-variant transition-all hover:-translate-y-0.5 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {/* Chat Input */}
        <div className="relative flex items-center bg-surface rounded-2xl border border-outline-variant/30 focus-within:border-stitch-primary focus-within:ring-2 focus-within:ring-stitch-primary/20 overflow-hidden shadow-sm transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-4 pl-5 pr-14 text-[14px] text-on-surface max-h-32 min-h-[56px] placeholder:text-on-surface-variant/50"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-stitch-primary text-white hover:bg-stitch-primary/90 disabled:bg-surface-variant disabled:text-on-surface-variant/30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPortfolioChat;
