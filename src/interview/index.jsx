import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from '@/auth';
import GlobalApi from '@/service/GlobalApi';
import { setResumeData } from '@/store/resumeSlice';
import { AIChatSession, extractCleanJson } from '@/service/AIModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, User, Bot, Loader2, ArrowLeft, Award, Sparkles, CheckCircle2, Shield, X, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function InterviewCoach() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const dispatch = useDispatch();

  const resumeData = useSelector((state) => state.resume.present.resumeData);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(resumeId || '');
  const [activeResume, setActiveResume] = useState(resumeData || null);
  const [customRole, setCustomRole] = useState('Senior Full Stack Engineer');

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Audio permission & voice recording state (JIT Onboarding)
  const [isRecording, setIsRecording] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasGrantedMicPermission, setHasGrantedMicPermission] = useState(false);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load user resumes if none provided in params
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GlobalApi.GetUserResumes(user.primaryEmailAddress.emailAddress).then(resp => {
        const list = resp?.data?.data || [];
        setUserResumes(list);
        if (!selectedResumeId && list.length > 0) {
          setSelectedResumeId(list[0].documentId || list[0].resumeId);
          setActiveResume(list[0]);
        }
      }).catch(err => console.error(err));
    }
  }, [user]);

  // Load chosen resume
  useEffect(() => {
    if (selectedResumeId) {
      setLoading(true);
      GlobalApi.GetResumeById(selectedResumeId).then((resp) => {
        const rData = resp?.data?.data;
        if (rData) {
          dispatch(setResumeData(rData));
          setActiveResume(rData);
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [selectedResumeId, dispatch]);

  // Teardown microphone tracks on unmount to avoid background drain and privacy leaks
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startInterview = async () => {
    setIsTyping(true);
    setMessages([]);
    setScorecard(null);

    const targetContext = activeResume 
      ? JSON.stringify(activeResume) 
      : `Target Role: ${customRole}`;

    const PROMPT = `You are an elite Silicon Valley technical & behavioral interviewer. I am the candidate.
Here is my resume context:
${targetContext}

Start the interview by warmly introducing yourself, naming the role you are interviewing me for, and asking the first thoughtful behavioral or technical question.
Keep your response conversational, concise (under 50 words), and ask ONLY one question.`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT, 'resume');
      const responseText = await result.response.text();
      setMessages([{ role: 'interviewer', content: responseText }]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to start interview.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    if (isRecording) {
      stopVoiceRecording();
    }

    const newMessages = [...messages, { role: 'candidate', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    const PROMPT = `Candidate response: "${inputMessage}".
Full conversation history:
${JSON.stringify(newMessages)}

Resume context:
${JSON.stringify(activeResume || customRole)}

Respond as the interviewer:
1. Provide a brief 1-sentence reaction to the answer.
2. Ask the next probing question (behavioral or technical) or conclude if 5+ exchanges have occurred.
Keep your response under 60 words and maintain a professional, supportive tone.`;

    try {
      const result = await AIChatSession.sendMessage(PROMPT, 'resume');
      const responseText = await result.response.text();
      setMessages([...newMessages, { role: 'interviewer', content: responseText }]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to receive response from interviewer.');
    } finally {
      setIsTyping(false);
    }
  };

  // Safe Voice Dictation Flow with JIT Permission Card
  const handleMicClick = () => {
    if (isRecording) {
      stopVoiceRecording();
      return;
    }

    if (!hasGrantedMicPermission) {
      setShowPermissionModal(true);
    } else {
      startVoiceRecording();
    }
  };

  const handleAcceptPermission = async () => {
    setShowPermissionModal(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setHasGrantedMicPermission(true);
      toast.success('Microphone enabled');
      startVoiceRecording();
    } catch (err) {
      console.error('Microphone permission error:', err);
      toast.error('Microphone access was denied. You can continue typing your answers.');
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast.info('Listening... Speak your answer.');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    // Release hardware tracks immediately to turn off device indicator and preserve battery
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    toast.success('Audio captured.');
  };

  const evaluateInterview = async () => {
    if (messages.length < 2) {
      toast.info('Answer at least one question before evaluating.');
      return;
    }
    setIsEvaluating(true);
    try {
      const PROMPT = `Based on this interview transcript:
${JSON.stringify(messages)}

Provide a structured candidate evaluation scorecard. Return ONLY valid JSON:
{
  "overallScore": 88,
  "communicationScore": 90,
  "technicalDepthScore": 85,
  "strengths": ["Clear articulation", "Structured STAR method usage"],
  "improvements": ["Elaborate more on quantitative metrics in production"],
  "hiringRecommendation": "Strong Hire"
}`;

      const result = await AIChatSession.sendMessage(PROMPT, 'resume');
      const responseText = await result.response.text();
      const parsed = extractCleanJson(responseText);
      if (parsed) {
        setScorecard(parsed);
        toast.success('Interview evaluated!');
      } else {
        throw new Error('Invalid scorecard format');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate scorecard.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full min-w-[44px] min-h-[44px]" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              AI Mock Interview Coach
            </h1>
            <p className="text-xs text-slate-500">Practice behavioral and role-specific technical questions</p>
          </div>
        </div>

        {/* Resume / Target role selector */}
        <div className="flex items-center gap-2">
          {userResumes.length > 0 ? (
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-3 py-2 font-medium text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-sky-500 min-h-[44px]"
              aria-label="Select Target Resume"
            >
              {userResumes.map(r => (
                <option key={r.documentId || r.resumeId} value={r.documentId || r.resumeId}>
                  {r.title || 'Untitled Resume'}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Target Role"
              className="text-xs bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 border-0 min-h-[44px]"
              aria-label="Target Role"
            >
            </input>
          )}

          {messages.length > 1 && !scorecard && (
            <Button
              onClick={evaluateInterview}
              disabled={isEvaluating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 min-h-[44px]"
            >
              {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
              <span>Score Interview</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Stream */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col gap-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="m-auto text-center max-w-md p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
              <Bot className="w-12 h-12 text-sky-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready to Ace Your Interview?</h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Our AI coach simulates real engineering & management interviews using your selected resume context.
              </p>
              <Button onClick={startInterview} disabled={isTyping} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-6 min-h-[48px]">
                Begin Mock Interview
              </Button>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'candidate' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                  {msg.role === 'candidate' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${msg.role === 'candidate' ? 'bg-sky-600 text-white rounded-tr-xs' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-xs text-slate-800 dark:text-slate-200 shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))
          )}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </main>

        {/* Optional Right Scorecard Modal / Panel */}
        {scorecard && (
          <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Scorecard
              </h3>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                {scorecard.hiringRecommendation}
              </span>
            </div>

            <div className="text-center py-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
              <span className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">{scorecard.overallScore}%</span>
              <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider mt-0.5">Overall Performance</p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Communication</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{scorecard.communicationScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${scorecard.communicationScore}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Technical Depth</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{scorecard.technicalDepthScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${scorecard.technicalDepthScore}%` }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Key Strengths</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {scorecard.strengths?.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Areas for Growth</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {scorecard.improvements?.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Input Area */}
      {messages.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3.5 shrink-0 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleMicClick}
              aria-label={isRecording ? "Stop voice dictation" : "Dictate answer with microphone"}
              className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? "Listening to your answer..." : "Type or speak your answer..."}
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 border-0 min-h-[48px]"
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-3 min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Send answer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Just-In-Time (JIT) Solid Permission Onboarding Card */}
      <AnimatePresence>
        {showPermissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Microphone Access for Voice Practice
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Practice answering interview questions out loud just like a real engineering interview.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Audio is transcribed in real-time and never saved on servers.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Microphone hardware disengages immediately when you stop speaking.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPermissionModal(false)}
                  className="flex-1 rounded-xl min-h-[44px]"
                >
                  Type Instead
                </Button>
                <Button
                  onClick={handleAcceptPermission}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl min-h-[44px]"
                >
                  Enable Microphone
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
