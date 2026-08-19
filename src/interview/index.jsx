import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GlobalApi from '@/service/GlobalApi';
import { setResumeData } from '@/store/resumeSlice';
import { AIChatSession } from '@/service/AIModal';
import { motion } from 'framer-motion';
import { Mic, Send, User, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function InterviewCoach() {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.resume.present.resumeData);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!resumeData && resumeId) {
      GlobalApi.GetResumeById(resumeId).then((resp) => {
        dispatch(setResumeData(resp.data.data));
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    } else {
        setLoading(false);
    }
  }, [resumeId, resumeData]);

  useEffect(() => {
      if (resumeData && messages.length === 0 && !loading) {
          startInterview();
      }
  }, [resumeData, loading]);

  const startInterview = async () => {
    setIsTyping(true);
    const PROMPT = `You are an expert technical and behavioral interviewer. I am the candidate. 
    Here is my resume data in JSON format:
    ${JSON.stringify(resumeData)}
    
    Start the interview by introducing yourself, welcoming me, and asking the first question based on my most recent experience or skills. 
    Keep your responses concise and conversational (under 50 words). Ask one question at a time.`;

    try {
        const result = await AIChatSession.sendMessage(PROMPT, 'resume');
        const responseText = result.response.text();
        setMessages([{ role: 'interviewer', content: responseText }]);
    } catch (error) {
        toast.error('Failed to start interview.');
    } finally {
        setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { role: 'candidate', content: userMessage }]);
    setInputMessage('');
    setIsTyping(true);

    try {
        const result = await AIChatSession.sendMessage(`My response: ${userMessage}. 
        Please provide feedback and the next question if this is not the last one.
        Maintain the strict JSON response format described initially.`, 'resume');
        const responseText = result.response.text();
        setMessages(prev => [...prev, { role: 'interviewer', content: responseText }]);
    } catch (error) {
        toast.error('Failed to send message.');
    } finally {
        setIsTyping(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-surface-container-low flex flex-col">
              <header className="bg-surface border-b border-outline-variant/30 h-16 flex items-center px-6 shrink-0 shadow-sm justify-between">
                  <Skeleton className="h-6 w-24 bg-surface-variant/50 rounded-md" />
                  <Skeleton className="h-8 w-48 bg-surface-variant/50 rounded-md" />
              </header>
              <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-6 custom-scrollbar">
                  <div className="flex gap-4 max-w-[80%]">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-surface-variant/50" />
                      <Skeleton className="h-24 w-full bg-surface-variant/50 rounded-2xl rounded-tl-sm" />
                  </div>
                  <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-surface-variant/50" />
                      <Skeleton className="h-16 w-64 bg-surface-variant/50 rounded-2xl rounded-tr-sm" />
                  </div>
              </main>
              <div className="bg-surface border-t border-outline-variant/30 p-4 shrink-0">
                  <div className="max-w-4xl mx-auto flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full shrink-0 bg-surface-variant/50" />
                      <Skeleton className="flex-1 h-14 rounded-full bg-surface-variant/50" />
                      <Skeleton className="w-14 h-14 rounded-full shrink-0 bg-surface-variant/50" />
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-outline-variant/30 h-16 flex items-center px-6 shrink-0 shadow-sm">
        <Link to={`/dashboard/resume/${resumeId}/edit`} className="flex items-center gap-2 text-on-surface-variant hover:text-stitch-primary transition-colors font-label-md">
            <ArrowLeft className="w-5 h-5" /> Back to Editor
        </Link>
        <div className="ml-auto flex items-center gap-2">
            <Bot className="w-6 h-6 text-stitch-primary" />
            <h1 className="font-headline-sm font-bold text-on-surface">AI Interview Coach</h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-6 custom-scrollbar">
        {messages.map((msg, idx) => (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex gap-4 max-w-[80%] ${msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : ''}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'candidate' ? 'bg-primary-container text-on-primary-container' : 'bg-stitch-primary/10 text-stitch-primary'}`}>
                    {msg.role === 'candidate' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'candidate' ? 'bg-stitch-primary text-white rounded-tr-sm' : 'bg-surface border border-outline-variant/30 rounded-tl-sm text-on-surface'} shadow-sm`}>
                    <p className="font-body-md leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
            </motion.div>
        ))}

        {isTyping && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 max-w-[80%]"
            >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-stitch-primary/10 text-stitch-primary">
                    <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 rounded-tl-sm shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-outline-variant animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </motion.div>
        )}
      </main>

      {/* Input Area */}
      <div className="bg-surface border-t border-outline-variant/30 p-4 shrink-0">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
            <button 
                onClick={() => toast.info("Voice input feature coming soon!")}
                className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant transition-colors shadow-sm"
            >
                <Mic className="w-5 h-5" />
            </button>
            <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response..."
                className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-full h-14 px-6 font-body-md focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary transition-all shadow-sm"
            />
            <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-14 h-14 rounded-full bg-stitch-primary text-white flex items-center justify-center hover:bg-stitch-primary/90 transition-all shadow-md disabled:opacity-50 disabled:hover:bg-stitch-primary"
            >
                <Send className="w-5 h-5 ml-1" />
            </button>
        </div>
      </div>
    </div>
  );
}
