import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Bot, User, Loader2, PanelLeftClose } from 'lucide-react';
import { AIChatSession } from '@/service/AIModal';
import { useSelector, useDispatch } from 'react-redux';
import { startLoading, stopLoading, selectIsLoading } from '@/store/loadingSlice';
import { buildContextObject } from '@/service/AITransformer';

export default function AiCoPilot({ activeBlockId, isOpen, onToggle }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your AI Co-Pilot. Click any section on the canvas and I can help you write or refine it!' }
  ]);
  const dispatch = useDispatch();
  const fullReduxState = useSelector(state => state);
  const isAILoading = useSelector(selectIsLoading('ai-generation'));
  const [loadingStateText, setLoadingStateText] = useState('');

  // Context-Aware Hint
  useEffect(() => {
    if (activeBlockId && isOpen) {
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', text: `I see you are editing the ${activeBlockId.toUpperCase()} section. Need me to generate some professional content for it?` }
      ]);
    }
  }, [activeBlockId, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage('');
    dispatch(startLoading('ai-generation'));
    setLoadingStateText('Analyzing context...');

    try {
        const contextStr = buildContextObject(fullReduxState);
        const blockContext = activeBlockId ? `The user is currently editing their ${activeBlockId} section.` : '';
        const prompt = `Context:\n${contextStr}\n${blockContext}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful answer based on the context above. Do not output markdown code blocks wrapping the entire response, just respond directly.`;
        
        setTimeout(() => setLoadingStateText('Drafting response...'), 1500);

        const result = await AIChatSession.sendMessage(prompt, 'portfolio');
        const aiResponse = result.response.text();
        setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
        console.error("AI Error:", error);
        setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
        dispatch(stopLoading('ai-generation'));
        setLoadingStateText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-slate-900/50 relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
              <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-white border border-gray-200 text-gray-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}>
                      {msg.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-[13px] shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-tl-none leading-relaxed'}`}>
                      {msg.text}
                  </div>
              </motion.div>
          ))}
          
          {isAILoading && (
              <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[90%]"
              >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shrink-0 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none flex items-center gap-2 shadow-sm">
                      <span className="text-[12px] text-gray-500 italic mr-2">{loadingStateText}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
              </motion.div>
          )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI to write this..."
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full pl-4 pr-10 py-2.5 text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button 
              type="submit"
              disabled={isAILoading || !message.trim()}
              className="absolute right-1.5 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            {isAILoading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5 -ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
