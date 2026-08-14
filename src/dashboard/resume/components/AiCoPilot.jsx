import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import { AIChatSession } from '../../../../service/AIModal';
import { useSelector } from 'react-redux';

export function AiCoPilot() {
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your Sparkfolio AI Co-Pilot. I can help rewrite your experience, suggest skills, or fix formatting. What do you need?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage('');
    setIsTyping(true);

    try {
        const prompt = `Context: The user has a resume with the following details:\n${JSON.stringify({
            summary: resumeInfo?.summary || resumeInfo?.summery,
            experience: resumeInfo?.experience || resumeInfo?.Experience,
            skills: resumeInfo?.skills,
            education: resumeInfo?.education
        })}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful answer based on the resume context above. Do not output markdown code blocks wrapping the entire response, just respond directly.`;
        const result = await AIChatSession.sendMessage(prompt);
        const aiResponse = result.response.text();
        setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
        console.error("AI Error:", error);
        setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-stitch-primary to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group border-2 border-white/20"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh] bg-surface-container-lowest rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden border border-outline-variant/30"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-stitch-primary to-purple-600 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-[16px] font-bold">AI Co-Pilot</h3>
                  <p className="font-label-sm text-[11px] text-white/80">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-surface-container-low/30 relative custom-scrollbar">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-stitch-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                {chatHistory.map((msg, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-surface border border-outline-variant/30' : 'bg-gradient-to-br from-stitch-primary to-purple-500 text-white'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-on-surface-variant" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl font-body-sm text-[14px] shadow-sm ${msg.role === 'user' ? 'bg-primary-container text-on-primary-container rounded-tr-none' : 'bg-surface text-on-surface border border-outline-variant/20 rounded-tl-none leading-relaxed'}`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                
                {isTyping && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 max-w-[85%]"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stitch-primary to-purple-500 text-white shrink-0 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="p-4 rounded-2xl bg-surface border border-outline-variant/20 rounded-tl-none flex items-center gap-1 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-stitch-primary/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-outline-variant/20">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask AI for improvements..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full pl-4 pr-12 py-3 font-body-sm text-[14px] text-on-surface focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary transition-all shadow-sm"
                />
                <button 
                    type="submit"
                    disabled={!message.trim()}
                    className="absolute right-2 w-8 h-8 bg-stitch-primary text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stitch-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
