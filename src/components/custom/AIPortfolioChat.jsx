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

      if (lowerInput.includes('add contact')) {
        aiResponse = "Adding a contact section...";
        dispatch(addBlock({ portfolioId, blockType: 'contact', blockName: 'Contact' }));
      } else if (lowerInput.includes('add about')) {
        aiResponse = "Adding an about section...";
        dispatch(addBlock({ portfolioId, blockType: 'about', blockName: 'About' }));
      } else if (lowerInput.includes('add project')) {
        aiResponse = "Adding a projects section...";
        dispatch(addBlock({ portfolioId, blockType: 'projects', blockName: 'Projects' }));
      } else if (lowerInput.includes('add skill')) {
        aiResponse = "Adding a skills section...";
        dispatch(addBlock({ portfolioId, blockType: 'skills', blockName: 'Skills' }));
      } else if (lowerInput.includes('dark mode')) {
        aiResponse = "Switching to dark mode (simulated)...";
        // Assuming we'd dispatch a theme change here
      } else {
        aiResponse = "I understood: " + userText + ". (This is a simulated response)";
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
    <div className="flex flex-col h-full bg-surface border-r border-outline-variant/30">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex items-center gap-2 bg-surface-container-low shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-on-primary-container" />
        </div>
        <h2 className="font-title-md font-semibold text-on-surface">AI Assistant</h2>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary-container' : 'bg-primary-container'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-on-secondary-container" />
                ) : (
                  <Bot className="w-4 h-4 text-on-primary-container" />
                )}
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-variant text-on-surface-variant rounded-tl-sm'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 shrink-0">
        {/* Quick Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar no-scrollbar">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-outline-variant/50 bg-surface hover:bg-surface-variant text-xs font-medium text-on-surface-variant transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {/* Chat Input */}
        <div className="relative flex items-center bg-surface rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to edit portfolio..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-sm text-on-surface max-h-32 min-h-[44px]"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-2 bottom-1.5 p-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPortfolioChat;
