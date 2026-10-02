import React, { useEffect, useState, useDeferredValue } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import FormSection from '../../components/FormSection';
import ThemeBuilder from '../../components/ThemeBuilder';
import ResumePreview from '../../components/ResumePreview';
import { ResumeATSScore } from '../../components/ResumeATSScore';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { setProfileData } from '@/store/profileSlice';
import { ActionCreators } from 'redux-undo';
import useUndoRedoKeyboard from '@/hooks/useUndoRedoKeyboard';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AtsScoreRing } from '../../components/AtsScoreRing';
import { ExportModal } from '../../components/ExportModal';
import { AtsRoastPanel } from '../../components/AtsRoastPanel';
import RawJsonEditor from '../../components/RawJsonEditor';
import MagicImportModal from '../../components/MagicImportModal';
import AiStudioSidePanel from '../../components/AiStudioSidePanel';
import MobileFormatDrawer from '../../components/MobileFormatDrawer';
import { Languages, Flame, MessageSquare, Undo2, Redo2, Github, Sparkles, FileEdit, Eye, Layers, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Smartphone, Monitor, Palette, Download, CheckCircle2, Clock, MoreHorizontal, ArrowLeft, Send, Mic, Plus, ThumbsUp, ThumbsDown, Trash2, HelpCircle, User as UserIcon, Copy, Loader2, Settings2, ShieldCheck } from 'lucide-react';
import { AIChatSession } from '@/service/AIModal';
import { buildContextObject } from '@/service/AITransformer';
import GitHubSyncModal from '@/components/custom/GitHubSyncModal';
import AiResumeGeneratorModal from '../../components/AiResumeGeneratorModal';
import { Skeleton } from '@/components/ui/skeleton';
import useScrollIntoViewOnFocus from '@/hooks/useScrollIntoViewOnFocus';
import ResponsiveBreadcrumbs from '@/components/custom/ResponsiveBreadcrumbs';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import GlobalEditorToolbar from '@/components/custom/GlobalEditorToolbar';
import MobileEditorNavigator, { useSwipeNavigation } from '@/components/custom/MobileEditorNavigator';

import { useUser } from '@/auth.jsx';

function EditResume() {
    const {resumeId}=useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    useScrollIntoViewOnFocus();
    useUndoRedoKeyboard();
    const dispatch = useDispatch();
    const resumeInfo = { ...useSelector(s => s.resume.present.resumeData), ...useSelector(s => s.profile.present) };
    const deferredResumeInfo = useDeferredValue(resumeInfo);
    const pastStates = useSelector(state => state.resume.past);
    const futureStates = useSelector(state => state.resume.future);
    const fullReduxState = useSelector(state => state);
    const [activeTab, setActiveTab] = useState('Content');
    const [view, setView] = useState('builder'); // 'chat', 'builder', or 'preview'
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAtsPanelOpen, setIsAtsPanelOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isFormatDrawerOpen, setIsFormatDrawerOpen] = useState(false);
    const [viewport, setViewport] = useState('desktop');
    const syncStatus = useSelector(state => state.sync.syncStatus);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    
    // Gemini-style mobile client states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
      { role: 'ai', text: 'Welcome to AI Studio. I have analyzed your resume data. I can optimize bullet points, tailor your summary, or check for missing ATS keywords. Ask me anything!' }
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleMobileChatSend = async (customPrompt) => {
        const textToSend = typeof customPrompt === 'string' ? customPrompt : chatMessage;
        if (!textToSend.trim() || isChatLoading) return;

        setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
        if (typeof customPrompt !== 'string') setChatMessage('');
        setIsChatLoading(true);

        try {
            const contextStr = buildContextObject(fullReduxState);
            const prompt = `Context Resume:\n${contextStr}\n\nUser Question: ${textToSend}\n\nProvide actionable, concise advice or concrete bullet proposals. Avoid Markdown triple backticks wrapping everything; directly provide clean, professional text ready to be inserted.`;
            
            const result = await AIChatSession.sendMessage(prompt, 'resume');
            const responseText = await result.response.text();
            setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);
        } catch (err) {
            console.error('AI Co-Pilot error:', err);
            setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an issue processing that. Please try again.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleCreateNewResume = async () => {
        const toastId = toast.loading("Creating a new blank resume...");
        try {
            const uuid = uuidv4();
            const data = {
                data: {
                    title: "Untitled Resume",
                    resumeId: uuid,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    userName: user?.fullName || "Anonymous",
                    themeColor: '#4f46e5'
                }
            };
            const resp = await GlobalApi.CreateNewResume(data);
            if (resp) {
                toast.success("New resume created!", { id: toastId });
                navigate('/dashboard/resume/' + resp.data.data.documentId + "/edit");
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create new resume", { id: toastId });
        }
    };

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const scrollRef = React.useRef(null);
    const isVisible = useHideOnScroll(scrollRef);

    const swipeHandlers = useSwipeNavigation({
      onSwipeLeft: () => {
        if (view === 'builder') {
          setView('preview');
        }
      },
      onSwipeRight: () => {
        if (view === 'preview') {
          setView('builder');
        }
      },
    });
    
    // Calculate progress
    const calculateProgress = () => {
        if (!resumeInfo) return 0;
        let score = 0;
        if (resumeInfo.firstName) score += 10;
        if (resumeInfo.jobTitle) score += 10;
        if (resumeInfo.summery) score += 20;
        if (resumeInfo.Experience?.length > 0) score += 30;
        if (resumeInfo.Education?.length > 0) score += 15;
        if (resumeInfo.skills?.length > 0) score += 15;
        return score;
    };
    const progress = calculateProgress();

    useEffect(()=>{
        if (resumeId) {
            GetResumeInfo();
        } else {
            setIsLoading(false); // Playground mode
        }
    },[resumeId])

    const GetResumeInfo=()=>{
        setIsLoading(true);
        GlobalApi.GetResumeById(resumeId).then(resp=>{
          const data = resp.data.data;
          dispatch(setResumeData(data));
          if (data) {
            dispatch(setProfileData({
              personalInfo: {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                jobTitle: data.jobTitle || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || ''
              },
              workExperience: data.Experience || data.experience || data.workExperience || [],
              education: data.education || data.Education || [],
              skills: data.skills || data.Skills || [],
              projects: data.projects || []
            }));
          }
        }).catch(err => {
          toast.error("Failed to load resume data");
        }).finally(() => {
          setIsLoading(false);
        })
    }





  return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-background text-on-background font-body-md h-[100dvh] w-screen overflow-hidden flex flex-col"
      >
        {/* Top Toolbar */}
        <GlobalEditorToolbar 
          view={view}
          setView={setView}
          onSave={() => {}} // Resume saves automatically via Redux middleware
          onExport={() => {
            if (!resumeId) {
              window.location.href = '/auth/sign-in';
            } else {
              setIsExportOpen(true);
            }
          }}
          onAddNew={handleCreateNewResume}
          mode="resume"
          title={`Draft - ${resumeInfo?.title || 'Loading...'}`}
        >
              {/* Sidebar Toggle (Only if not zen mode) */}
              {!isZenMode && (
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant w-7 h-7 rounded-full flex items-center justify-center transition-colors mr-1"
                  title="Toggle Sidebar"
                >
                  <span className="material-symbols-outlined text-[18px]">{isSidebarOpen ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}</span>
                </button>
              )}

              {/* Viewport Switcher */}
              <div className="hidden md:flex bg-surface-container-low rounded-lg p-0.5 border border-outline-variant/20 mr-1">
                <button 
                  aria-label="Desktop preview"
                  onClick={() => setViewport('desktop')} 
                  className={`w-7 h-7 rounded-md focus:outline-none focus:ring-2 focus:ring-stitch-primary ${viewport === 'desktop' ? 'bg-white shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'} transition-colors flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-[16px]">desktop_mac</span>
                </button>
                <button 
                  aria-label="Mobile preview"
                  onClick={() => setViewport('mobile')} 
                  className={`w-7 h-7 rounded-md focus:outline-none focus:ring-2 focus:ring-stitch-primary ${viewport === 'mobile' ? 'bg-white shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'} transition-colors flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                </button>
              </div>

              <div className="w-px h-5 bg-outline-variant/50"></div>
              
              {/* Zoom Controls with Auto-Fit */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} 
                  className="text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant w-6 h-6 rounded flex items-center justify-center transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="font-label-sm text-[12px] w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))} 
                  className="text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant w-6 h-6 rounded flex items-center justify-center transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
                <button
                  onClick={() => setZoom(0.85)}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container-low hover:bg-surface-variant text-on-surface-variant hover:text-stitch-primary font-medium transition-colors ml-0.5"
                  title="Fit to Editor Width (85%)"
                >
                  Fit
                </button>
              </div>

              <div className="w-px h-5 bg-outline-variant/50"></div>
              
              {/* AI Resume Generator Guided Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-semibold transition-colors"
                title="AI Resume Generator"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Generator</span>
              </button>

              <div className="w-px h-5 bg-outline-variant/50"></div>

              {/* AI Studio Collapsible Panel Trigger */}
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] ${
                  isAiPanelOpen 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                }`}
                title="Toggle AI Studio Panel"
                aria-label="Toggle AI Studio Panel"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Studio</span>
              </button>

              <div className="w-px h-5 bg-outline-variant/50"></div>
              <button 
                aria-label={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                onClick={() => setIsZenMode(!isZenMode)}
                className={`w-7 h-7 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stitch-primary transition-colors ${isZenMode ? 'bg-stitch-primary/10 text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant'}`}
                title="Zen Mode"
              >
                <span className="material-symbols-outlined text-[18px]">{isZenMode ? 'fullscreen_exit' : 'fullscreen'}</span>
              </button>
              <Link aria-label="Open in new tab" to={'/my-resume/'+resumeId+"/view"} target="_blank" className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant focus:outline-none focus:ring-2 focus:ring-stitch-primary transition-colors" title="Open in new tab">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
        </GlobalEditorToolbar>

        <AiResumeGeneratorModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          initialRole={resumeInfo?.jobTitle || resumeInfo?.title || ''}
          candidateName={`${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''}`.trim()}
          candidateEmail={resumeInfo?.email || ''}
          onApply={(generated) => {
            dispatch(setResumeData({
              ...resumeInfo,
              ...generated,
              documentId: resumeId,
              resumeId
            }));
            toast.success('Generated credentials applied to editor!');
          }}
        />

        <ExportModal 
          isOpen={isExportOpen} 
          onOpenChange={setIsExportOpen} 
          resumeInfo={resumeInfo} 
        />

        <AtsRoastPanel 
          isOpen={isAtsPanelOpen}
          onClose={() => setIsAtsPanelOpen(false)}
        />

        {/* Mobile View Switcher (Sticky sub-header directly below top toolbar) */}
        <div className="hidden md:block">
          <MobileEditorNavigator
            view={view}
            onViewChange={setView}
            syncStatus={syncStatus}
            onDownload={() => setIsExportOpen(true)}
          />
        </div>

        {/* Workspace Area */}
        <main {...swipeHandlers} className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950 md:pt-16">
          {/* Mobile Gemini-style Chat Workspace */}
          {view === 'chat' && (
            <div className="md:hidden flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-hidden">
                {/* 1. Ran / Active Top Panel */}
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm"></span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Gemini 3.5 Flash • Ran for 90s</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-85">Auto-saved</span>
                </div>

                {/* 2. Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950">
                  {chatHistory.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${item.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                        item.role === 'user' 
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200' 
                          : 'bg-indigo-600 text-white shadow-md'
                      }`}>
                        {item.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        item.role === 'user'
                          ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none shadow-xs space-y-2'
                      }`}>
                        <div className="whitespace-pre-wrap">{item.text}</div>
                        {item.role === 'ai' && (
                          <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Checkpoint</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.text);
                                toast.success('Copied to clipboard');
                              }}
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                            <button onClick={() => toast.success('Feedback received')} className="hover:text-emerald-500 transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => toast.success('Feedback received')} className="hover:text-rose-500 transition-colors">
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-tl-none flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shadow-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                        <span>AI Studio is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Floating Error/Code Status Pill (directly above prompt) */}
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/80 shrink-0">
                  <div className="p-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/30 dark:border-indigo-800/40 rounded-xl flex items-center justify-between text-[11px] text-indigo-950 dark:text-indigo-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-medium">All database edits successfully synced to cloud</span>
                    </div>
                    <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-700 dark:text-indigo-300">Synced</span>
                  </div>
                </div>

                {/* 4. Chat Prompt Box */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 pb-20">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-2 flex flex-col gap-2 shadow-xs">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Make changes, add new features, ask for anything"
                      rows={2}
                      className="w-full bg-transparent resize-none focus:outline-none text-xs px-3 py-1.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border-none outline-none ring-0 focus:ring-0 focus:ring-offset-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleMobileChatSend();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 px-1">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setIsAiModalOpen(true)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center gap-1 cursor-default">
                            Build
                          </span>
                        </div>
                        <button type="button" onClick={() => toast.info('Voice inputs are coming soon!')} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all">
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleMobileChatSend}
                        disabled={isChatLoading || !chatMessage.trim()}
                        className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center disabled:opacity-40 transition-all shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          )}

          {/* Left Sidebar: Content Editor */}
          {!isZenMode && (
            <aside className={`w-full md:w-[440px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto flex-col z-10 shadow-sm transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-[440px]'} ${view === 'builder' ? 'flex' : 'hidden md:flex'}`}>
              
              {/* Header area of sidebar with toggle */}
              <div className="hidden md:flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                 {/* Segmented Control Tabs */}
                 <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-full gap-1 border border-slate-200 dark:border-slate-700/60">
                    <button onClick={() => setActiveTab('Content')} className={`flex-1 py-2 rounded-lg text-center text-xs font-semibold min-h-[44px] transition-all ${activeTab === 'Content' ? 'bg-white dark:bg-slate-900 shadow-sm text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Content</button>
                    <button onClick={() => setActiveTab('Theme')} className={`flex-1 py-2 rounded-lg text-center text-xs font-semibold min-h-[44px] transition-all ${activeTab === 'Theme' ? 'bg-white dark:bg-slate-900 shadow-sm text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Theme</button>
                    <button onClick={() => setActiveTab('Settings')} className={`flex-1 py-2 rounded-lg text-center text-xs font-semibold min-h-[44px] transition-all ${activeTab === 'Settings' ? 'bg-white dark:bg-slate-900 shadow-sm text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Settings</button>
                    <button onClick={() => setActiveTab('ATS')} className={`flex-1 py-2 rounded-lg text-center text-xs font-semibold min-h-[44px] transition-all ${activeTab === 'ATS' ? 'bg-white dark:bg-slate-900 shadow-sm text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>ATS</button>
                 </div>
              </div>
              
              <div ref={scrollRef} className="p-4 flex flex-col flex-1 pb-28 md:pb-24 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <>
                    {activeTab === 'Content' && <FormSection />}
                    {activeTab === 'Theme' && <ThemeBuilder />}
                    {activeTab === 'Settings' && <div className="flex-1 mt-4"><RawJsonEditor /></div>}
                    {activeTab === 'ATS' && <div className="flex-1 mt-4"><ResumeATSScore /></div>}
                  </>
                )}
              </div>
            </aside>
          )}

          {/* Right Preview Canvas */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}>
            {/* Clean A4 Canvas with Mobile Auto-Fit */}
            <div 
              className="w-full h-full flex flex-col bg-surface-container/50 overflow-hidden py-4 md:py-8"
              onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ show: true, x: e.pageX, y: e.pageY });
              }}
              onClick={() => setContextMenu({ show: false, x: 0, y: 0 })}
            >
              <div className={`flex-1 overflow-y-auto overflow-x-hidden w-full h-full custom-scrollbar flex justify-center items-start pb-36 md:pb-16 transition-all px-2 sm:px-4`}>
                 {(() => {
                   const isMobileView = windowWidth < 768;
                   // Calculate available workspace width dynamically across mobile, tablet, and desktop screens
                   const approxAvailableWidth = isMobileView
                     ? windowWidth - 24
                     : Math.max(340, windowWidth - (isSidebarOpen && !isZenMode ? 440 : 0) - (isAiPanelOpen ? 320 : 0) - 64);
                   
                   // Responsive auto-fit ratio so the sheet never clips horizontally on any device
                   const autoFitScale = Math.min(1, Math.max(0.32, approxAvailableWidth / 794));
                   const activeScale = Number(((viewport === 'mobile' ? autoFitScale * 0.55 : autoFitScale) * zoom).toFixed(3));
                   const marginAdjustment = `${(activeScale - 1) * 1122}px`;

                   return isLoading ? (
                     <div 
                       className="bg-white w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] rounded-[3px] flex-shrink-0 mt-4 sm:mt-6 break-words p-10 flex flex-col gap-6" 
                       style={{ 
                         transform: `scale(${activeScale})`, 
                         transformOrigin: 'top center',
                         marginBottom: marginAdjustment,
                         transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), margin 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                       }}
                     >
                       <Skeleton className="h-32 w-full rounded-none" />
                       <Skeleton className="h-12 w-3/4 rounded-none" />
                       <Skeleton className="h-8 w-full rounded-none" />
                       <Skeleton className="h-64 w-full rounded-none" />
                     </div>
                   ) : (
                     <div 
                       className="bg-white text-slate-900 w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] rounded-[3px] flex-shrink-0 mt-4 sm:mt-6 break-words antialiased select-text"
                       style={{ 
                         transform: `scale(${activeScale})`, 
                         transformOrigin: 'top center',
                         marginBottom: marginAdjustment,
                         transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), margin 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                       }}
                     >
                       <ResumePreview resumeInfo={deferredResumeInfo} />
                     </div>
                   );
                 })()}
              </div>
            </div>

            {/* Floating Interactive Canvas Zoom & Viewport Dock */}
            {view !== 'preview' && (
              <div className="absolute bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2">
                {/* Zoom Out */}
                <button 
                  onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Zoom Out (-10%)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                
                {/* Interactive Zoom Slider & Value */}
                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="range" 
                    min="0.4" 
                    max="1.6" 
                    step="0.05"
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-16 sm:w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    aria-label="Canvas Zoom Level"
                  />
                  <span className="text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-300 w-10 text-center font-bold">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Zoom In */}
                <button 
                  onClick={() => setZoom(prev => Math.min(1.6, Number((prev + 0.1).toFixed(1))))}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Zoom In (+10%)"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>

                {/* Page Fit Reset */}
                <button 
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                  title="Reset zoom to 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Fit</span>
                </button>

                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>

                {/* Fullscreen / Zen Toggle */}
                <button 
                  onClick={() => setIsZenMode(!isZenMode)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isZenMode 
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isZenMode ? "Exit Fullscreen Canvas" : "Fullscreen Canvas"}
                  aria-label="Toggle Fullscreen Canvas"
                >
                  {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Viewport switch (Desktop / Mobile Preview) */}
                <button 
                  onClick={() => setViewport(viewport === 'desktop' ? 'mobile' : 'desktop')}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewport === 'mobile' 
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title={viewport === 'mobile' ? "Switch to Desktop view" : "Switch to Mobile view"}
                  aria-label="Toggle mobile device view"
                >
                  {viewport === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Custom Context Menu */}
            <AnimatePresence>
                {contextMenu.show && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        className="fixed z-50 bg-surface-container-highest border border-outline-variant/30 rounded-xl shadow-xl w-48 overflow-hidden py-2 font-label-md text-[14px] text-on-surface"
                    >
                        <button 
                            className="w-full text-left px-4 py-2 hover:bg-surface-variant flex items-center gap-2"
                            onClick={() => { setActiveTab('Content'); setIsZenMode(false); setContextMenu({show:false,x:0,y:0}); }}
                        >
                            <span className="material-symbols-outlined text-[16px]">edit_document</span> Edit Content
                        </button>
                        <button 
                            className="w-full text-left px-4 py-2 hover:bg-surface-variant flex items-center gap-2"
                            onClick={() => { setActiveTab('Theme'); setIsZenMode(false); setContextMenu({show:false,x:0,y:0}); }}
                        >
                            <span className="material-symbols-outlined text-[16px]">palette</span> Change Theme
                        </button>
                        <div className="h-px bg-outline-variant/30 my-1"></div>
                        <button 
                            className="w-full text-left px-4 py-2 hover:bg-surface-variant flex items-center gap-2 text-stitch-primary"
                            onClick={() => { setIsExportOpen(true); setContextMenu({show:false,x:0,y:0}); }}
                        >
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span> Launch
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
          </section>

          {/* Right Collapsible AI Studio Panel (Desktop & Mobile Drawer) */}
          <AiStudioSidePanel 
            isOpen={isAiPanelOpen}
            onClose={() => setIsAiPanelOpen(false)}
            onOpen={() => setIsAiPanelOpen(true)}
            resumeInfo={deferredResumeInfo}
          />
        </main>
      
        {/* Format & Style Mobile Bottom Sheet Drawer */}
        <MobileFormatDrawer
          isOpen={isFormatDrawerOpen}
          onClose={() => setIsFormatDrawerOpen(false)}
          documentId={resumeId}
        />

        {/* Gemini-style Mobile bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-4 pt-3 pb-[calc(0.7rem+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-1 shadow-lg">
          {/* Left Back Arrow */}
          <Link to="/dashboard" className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Center Pill Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700/60 max-w-[280px] flex-1">
            <button
              onClick={() => setView('chat')}
              className={`relative flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                view === 'chat'
                  ? 'bg-white dark:bg-slate-950 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setView('preview')}
              className={`relative flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                view === 'preview'
                  ? 'bg-white dark:bg-slate-950 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('builder')}
              className={`relative flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                view === 'builder'
                  ? 'bg-white dark:bg-slate-950 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Editor
            </button>
          </div>

          {/* Right Option Menu (Three Dots) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white relative active:scale-95 transition-all"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini-style Three-Dots Floating Menu Options Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/10 dark:bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed bottom-[80px] right-4 z-50 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 px-1 flex flex-col gap-0.5"
              >
                <button
                  onClick={() => { setIsExportOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>Export / Download PDF</span>
                </button>
                <button
                  onClick={() => { setActiveTab('Theme'); setView('builder'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span>Theme Builder</span>
                </button>
                <button
                  onClick={() => { setActiveTab('Settings'); setView('builder'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Settings2 className="w-4 h-4 text-blue-500" />
                  <span>Raw JSON Settings</span>
                </button>
                <button
                  onClick={() => { setActiveTab('ATS'); setView('builder'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>ATS Score & Audit</span>
                </button>
                <button
                  onClick={() => { setIsAiModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>Guided AI Generator</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>


      </motion.div>
  )
}

export default EditResume