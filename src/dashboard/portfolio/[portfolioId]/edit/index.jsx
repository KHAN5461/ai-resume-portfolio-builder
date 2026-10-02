import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPortfolio } from '@/store/portfolioSlice';
import { ActionCreators } from 'redux-undo';
import useUndoRedoKeyboard from '@/hooks/useUndoRedoKeyboard';
import BlockPalette from '../../components/BlockPalette';
import CanvasArea from '../../components/CanvasArea';
import UnifiedInspector from '../../components/UnifiedInspector';
import AIPortfolioChat from '@/components/custom/AIPortfolioChat';
import GenerativeCanvasLoader from '../../components/GenerativeCanvasLoader';
import PreviewWindow from './components/PreviewWindow';
import { updatePortfolioData } from '@/store/portfolioSlice';
import GlobalApi from './../../../../../service/GlobalApi';
import { generatePortfolioReactCode } from '@/lib/codeExporter';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useUser } from '@/auth.jsx';
import { AIChatSession, extractCleanJson } from '@/service/AIModal';
import SeoSettingsModal from '../../components/SeoSettingsModal';
import { DeployModal } from '../../components/DeployModal';
import { calculateSeoScore } from '@/lib/seoScorer';
import { Skeleton } from '@/components/ui/skeleton';
import ResponsiveBreadcrumbs from '@/components/custom/ResponsiveBreadcrumbs';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import { Undo2, Redo2, Bot, Settings2, Monitor, Tablet, Smartphone, Sparkles, ChevronLeft, ChevronRight, LayoutGrid, Eye, MoreHorizontal, ArrowLeft, Palette, ShieldCheck, Download, PanelRightOpen, PanelRight } from 'lucide-react';
import GlobalEditorToolbar from '@/components/custom/GlobalEditorToolbar';
import PortfolioHealthScore from '../../components/PortfolioHealthScore';
import SharedThemeBuilder from '@/components/custom/SharedThemeBuilder';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function EditPortfolio() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  useUndoRedoKeyboard();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  const pastStates = useSelector((state) => state.portfolio.past);
  const futureStates = useSelector((state) => state.portfolio.future);
  const { user } = useUser();
  const seoData = calculateSeoScore(portfolioData, portfolioData?.blocks || []);

  const handleCreateNewPortfolio = async () => {
    const toastId = toast.loading("Creating a new blank portfolio...");
    try {
      const uuid = uuidv4();
      const data = {
        data: {
          title: "Untitled Portfolio",
          portfolioId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName || "Anonymous",
          themeColor: '#4f46e5',
          siteConfig: {
            layout: [
              { id: 'hero', visible: true, name: 'Hero' },
              { id: 'about', visible: true, name: 'About' },
              { id: 'projects', visible: true, name: 'Projects' },
              { id: 'skills', visible: true, name: 'Skills' },
              { id: 'contact', visible: true, name: 'Contact' }
            ]
          }
        }
      };
      const resp = await GlobalApi.CreateNewPortfolio(data);
      if (resp) {
        toast.success("New portfolio created!", { id: toastId });
        navigate('/dashboard/portfolio/' + resp.data.data.documentId + "/edit");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new portfolio", { id: toastId });
    }
  };

  const [view, setView] = useState('builder'); // 'chat', 'builder', or 'preview'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState('hero');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  
  // AI Panel State
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(380);
  
  const startResizing = React.useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = chatPanelWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth > 250 && newWidth < 800) {
        setChatPanelWidth(newWidth);
      }
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [chatPanelWidth]);

  // AI Generation Focus Mode
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isGeneratingParam = searchParams.get('generating') === 'true';
  const [isGenerating, setIsGenerating] = useState(isGeneratingParam);
  const aiPrompt = location.state?.prompt || '';

  const scrollRef = React.useRef(null);
  const isVisible = useHideOnScroll(scrollRef);

  // On mount, set current portfolio ID to load it into focus
  useEffect(() => {
    if (portfolioId) {
      setIsLoading(true);
      GlobalApi.GetPortfolioById(portfolioId).then(resp => {
        if (resp.data.data) {
          dispatch({ type: 'portfolio/updatePortfolioData', payload: { id: portfolioId, data: resp.data.data } });
          dispatch(setCurrentPortfolio(portfolioId));
        }
      }).catch(err => {
        toast.error("Failed to load portfolio");
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [portfolioId, dispatch]);

  // Auto-save to backend
  useEffect(() => {
    if (portfolioData && portfolioId) {
       const delayDebounceFn = setTimeout(() => {
          setIsSaving(true);
          GlobalApi.UpdatePortfolioDetail(portfolioId, { data: portfolioData })
            .catch(() => {
               toast.error("Auto-save failed");
            })
            .finally(() => {
               setIsSaving(false);
            });
       }, 2000);
       return () => clearTimeout(delayDebounceFn);
    }
  }, [portfolioData, portfolioId]);

  // AI Generation Workflow moved to AIPortfolioChat for visible scaffolding

  const handleAutoFill = async () => {
    if (!user) {
      toast.error("You must be logged in to sync from your resume.");
      return;
    }
    setIsSyncing(true);
    const toastId = toast.loading("Fetching your resume data...");
    
    try {
      const resp = await GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress);
      const resumes = resp.data.data;
      if (!resumes || resumes.length === 0) {
        toast.error("No resumes found in your account.", { id: toastId });
        setIsSyncing(false);
        return;
      }
      
      const latestResume = resumes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
      toast.loading("AI is crafting your portfolio...", { id: toastId });
      
      const prompt = `
        You are an expert personal branding copywriter. I am providing you with my resume data in JSON format.
        Please extract the information and transform it into a highly engaging, conversational Portfolio format.
        
        Resume Data:
        ${JSON.stringify(latestResume)}
        
        Provide the response in the following JSON structure ONLY, with no extra text:
        {
          "heroSection": {
            "greeting": "Hi, I'm [FirstName]",
            "headline": "A short, punchy 3-5 word headline (e.g. Full Stack Developer)",
            "subheadline": "A longer, 1-2 sentence compelling summary of my value proposition"
          },
          "aboutSection": {
            "bioTitle": "About Me",
            "bioDescription": "A conversational, well-written 2-3 paragraph biography adapted from my resume summary and experience."
          },
          "skillsSection": {
            "categories": [
              { "name": "Frontend", "skills": ["React", "CSS"] }, // Extract based on my resume
              { "name": "Backend", "skills": ["Node.js"] }
            ]
          }
        }
      `;
      
      const result = await AIChatSession.sendMessage(prompt, 'portfolio');
      const rawText = result.response.text();
      let parsedData = extractCleanJson(rawText);
      
      if (!parsedData) {
        console.warn("[Portfolio Sync] Sync generation failed to parse. Utilizing structured fallbacks.");
        parsedData = {
          heroSection: {
            greeting: `Hi, I'm ${latestResume.personalInfo?.name || "a Professional"}`,
            headline: latestResume.personalInfo?.title || "Software Engineer",
            subheadline: latestResume.summary || "Professional software engineer with a dedication to craft, detail, and quality solutions."
          },
          aboutSection: {
            bioTitle: "About Me",
            bioDescription: latestResume.summary || "I am a dedicated software engineer with deep passion for building robust web applications and solving complex architectural problems."
          },
          skillsSection: {
            categories: [
              { name: "Core Skills", skills: (latestResume.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean) }
            ]
          }
        };
      }
      
      dispatch({ 
        type: 'portfolio/updatePortfolioData', 
        payload: { 
          id: portfolioId, 
          data: {
            heroSection: parsedData.heroSection,
            aboutSection: parsedData.aboutSection,
            skillsSection: parsedData.skillsSection,
            projectsSection: latestResume.projects || [],
            experience: latestResume.experience || [],
            education: latestResume.education || [],
            personalInfo: latestResume.personalInfo || {}
          } 
        } 
      });
      
      toast.success("Portfolio successfully synced and enhanced!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync from resume.", { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ErrorBoundary>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-background text-on-background font-body-md w-full h-full overflow-hidden flex flex-col z-50"
    >
        {/* Top Toolbar */}
        <GlobalEditorToolbar 
          view={view}
          setView={setView}
          mode="portfolio"
          title={`Portfolio Editor`}
          portfolioData={portfolioData}
          onSave={() => setIsDeployModalOpen(true)}
          onAddNew={handleCreateNewPortfolio}
        >
            {/* Health Score */}
            <div className="flex items-center gap-1 border-r border-outline-variant/30 pr-2 md:pr-4 mr-1 md:mr-2">
              <PortfolioHealthScore portfolioId={portfolioId} />
            </div>
            {/* Undo / Redo Buttons */}
            <div className="flex items-center gap-1 border-r border-outline-variant/30 pr-2 md:pr-4 mr-1 md:mr-2">
              <button
                onClick={() => dispatch(ActionCreators.undo())}
                disabled={pastStates.length === 0}
                className="w-10 h-10 hover:bg-surface-variant transition-colors cursor-pointer text-on-surface-variant hover:text-stitch-primary rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed group"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => dispatch(ActionCreators.redo())}
                disabled={futureStates.length === 0}
                className="w-10 h-10 hover:bg-surface-variant transition-colors cursor-pointer text-on-surface-variant hover:text-stitch-primary rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed group"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* More Options Icon in Header */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-xl border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant transition-colors cursor-pointer"
                  title="More Options"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50">
                <DropdownMenuItem 
                  onClick={() => setIsThemeModalOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span>Theme & Architecture</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsAIChatOpen(!isAIChatOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>{isAIChatOpen ? 'Hide AI Copilot' : 'Show AI Copilot'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <Settings2 className="w-4 h-4 text-purple-500" />
                  <span>{isPropertiesPanelOpen ? 'Hide Properties' : 'Show Properties'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsSeoModalOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>SEO Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </GlobalEditorToolbar>

        {/* Workspace Area */}
        <main className="flex-1 flex overflow-hidden bg-surface-container-low relative md:pt-16">
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

                {/* 2. Messages / Active Chat Panel */}
                <div className="flex-1 overflow-hidden">
                  <AIPortfolioChat portfolioId={portfolioId} initialPrompt={aiPrompt} isGenerating={isGenerating} />
                </div>
            </div>
          )}

          {/* Editor Workspace (Property Panel Page) */}
          {view === 'builder' && (
            <div className="md:hidden flex-1 flex flex-col bg-white dark:bg-slate-950 h-full overflow-hidden">
              <UnifiedInspector 
                activeBlockId={activeBlockId} 
                setActiveBlockId={setActiveBlockId} 
                isOpen={true} 
                onToggle={() => {}} 
                isFullPage={true}
              />
            </div>
          )}
          
          {/* 1. Left Sidebar (AI Chat) */}
          {!isLoading && (
            <>
              {isAIChatOpen ? (
                <div 
                  key="chat-open"
                  className="hidden md:flex flex-col h-full shrink-0 z-10 bg-surface relative group border-r border-outline-variant/30"
                  style={{ width: chatPanelWidth }}
                >
                  {/* Left Sidebar Body Content */}
                  <div className="flex-1 overflow-hidden flex flex-col h-full">
                    <AIPortfolioChat portfolioId={portfolioId} initialPrompt={aiPrompt} isGenerating={isGenerating} />
                  </div>
                  
                  {/* Collapse Button */}
                  <button 
                    onClick={() => setIsAIChatOpen(false)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-surface border border-outline-variant/30 rounded-full flex items-center justify-center shadow-sm z-50 text-on-surface-variant hover:text-stitch-primary hover:border-stitch-primary transition-colors opacity-0 group-hover:opacity-100"
                    title="Collapse AI Panel"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>

                  {/* Drag Handle */}
                  <div 
                    onMouseDown={startResizing}
                    className="absolute -right-1 top-0 w-2 h-full cursor-col-resize hover:bg-stitch-primary/30 active:bg-stitch-primary/50 transition-colors z-40"
                  />
                </div>
              ) : null}
            </>
          )}

          {/* Floating tab on left edge to open AI panel when closed */}
          {!isAIChatOpen && !isLoading && (
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-900 border-r border-y border-slate-200 dark:border-slate-800 shadow-xl px-2.5 py-4 rounded-r-xl flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-all cursor-pointer group hover:pl-3.5"
              title="Open AI Copilot"
              aria-label="Open AI Copilot"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-wider uppercase text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400">AI Copilot</span>
            </button>
          )}

          {/* 2. Center Preview Canvas */}
          <main className={`flex-1 relative flex flex-col overflow-hidden bg-surface-container-lowest bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-4 md:p-8 h-full shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}>
            <PreviewWindow rawCode={portfolioData ? generatePortfolioReactCode(portfolioData) : ""} hideHeader={view === 'preview'}>
               <div className="flex-1 overflow-y-auto bg-background relative w-full h-full custom-scrollbar rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                  {/* Removed GenerativeCanvasLoader */}
                  {isLoading ? (
                    <div className="p-10 flex flex-col gap-8 bg-surface">
                      <Skeleton className="h-64 w-full rounded-xl" />
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                  ) : (
                      <CanvasArea 
                        blocks={portfolioData?.siteConfig?.layout || []} 
                        portfolioData={portfolioData}
                        onSelectBlock={(id) => {
                          setActiveBlockId(id);
                          if (!isPropertiesPanelOpen) setIsPropertiesPanelOpen(true);
                        }}
                        activeBlockId={activeBlockId}
                        isPreview={view === 'preview'}
                      />
                  )}
               </div>
            </PreviewWindow>
          </main>

          {/* Floating tab on right edge to open right side panel when closed */}
          {!isPropertiesPanelOpen && !isLoading && !isGenerating && (
            <button
              onClick={() => setIsPropertiesPanelOpen(true)}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-900 border-l border-y border-slate-200 dark:border-slate-800 shadow-xl px-2 py-4 rounded-l-xl flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-all cursor-pointer group hover:pr-3"
              title="Open Right Side Panel"
              aria-label="Open Right Side Panel"
            >
              <PanelRightOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="[writing-mode:vertical-rl] text-[10px] font-bold tracking-wider uppercase text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400">Properties</span>
            </button>
          )}

          {/* 3. Right Properties Panel (Unified Inspector) */}
          {!isLoading && !isGenerating && <UnifiedInspector activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} isOpen={isPropertiesPanelOpen} onToggle={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)} />}
        </main>
        


        <SeoSettingsModal isOpen={isSeoModalOpen} onClose={() => setIsSeoModalOpen(false)} />
        <DeployModal isOpen={isDeployModalOpen} onOpenChange={setIsDeployModalOpen} portfolioId={portfolioId} portfolioData={portfolioData} />

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
                  onClick={() => { setIsThemeModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span>Theme & Architecture</span>
                </button>
                <button
                  onClick={() => { setIsDeployModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>Deploy / Export Live Site</span>
                </button>
                <button
                  onClick={() => { setIsPropertiesPanelOpen(true); setView('builder'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Settings2 className="w-4 h-4 text-purple-500" />
                  <span>Inspect Block Elements</span>
                </button>
                <button
                  onClick={() => { setIsSeoModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>SEO Score & Tags</span>
                </button>
                <button
                  onClick={() => { handleAutoFill(); setMobileMenuOpen(false); }}
                  disabled={isSyncing}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-45"
                >
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>{isSyncing ? "Syncing..." : "Sync from CV data"}</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Theme, Layout & Colors Modal */}
        <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" />
                Theme, Colors & Architecture
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Customize layout architecture, color palette, and color scheme.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <SharedThemeBuilder type="portfolio" documentId={portfolioId} />
            </div>
          </DialogContent>
        </Dialog>
    </motion.div>
    </ErrorBoundary>
  );
}
