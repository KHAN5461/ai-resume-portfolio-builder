import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPortfolio } from '@/store/portfolioSlice';
import { ActionCreators } from 'redux-undo';
import useUndoRedoKeyboard from '@/hooks/useUndoRedoKeyboard';
import BlockPalette from '../../components/BlockPalette';
import CanvasArea from '../../components/CanvasArea';
import PropertiesPanel from '../../components/PropertiesPanel';
import LeftSidebar from '../../components/LeftSidebar';
import { updatePortfolioData } from '@/store/portfolioSlice';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useUser } from '@/auth.jsx';
import { AIChatSession } from '@/service/AIModal';
import SeoSettingsModal from '../../components/SeoSettingsModal';
import { DeployModal } from '../../components/DeployModal';
import { calculateSeoScore } from '@/lib/seoScorer';
import { Skeleton } from '@/components/ui/skeleton';
import ResponsiveBreadcrumbs from '@/components/custom/ResponsiveBreadcrumbs';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import { Undo2, Redo2, Bot, Settings2, Monitor, Tablet, Smartphone } from 'lucide-react';
import GlobalEditorToolbar from '@/components/custom/GlobalEditorToolbar';

export default function EditPortfolio() {
  const { portfolioId } = useParams();
  useUndoRedoKeyboard();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  const pastStates = useSelector((state) => state.portfolio.past);
  const futureStates = useSelector((state) => state.portfolio.future);
  const { user } = useUser();
  const seoData = calculateSeoScore(portfolioData, portfolioData?.blocks || []);

  const [view, setView] = useState('builder'); // 'builder' or 'preview'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBlockId, setActiveBlockId] = useState('hero');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);

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
      
      const result = await AIChatSession.sendMessage(prompt);
      const rawText = result.response.text();
      const parsedData = JSON.parse(rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, ''));
      
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
      className="bg-background text-on-background font-body-md h-[100dvh] w-screen overflow-hidden flex flex-col"
    >
        {/* Top Toolbar */}
        <GlobalEditorToolbar 
          view={view}
          setView={setView}
          mode="portfolio"
          title={`Portfolio Editor`}
        >
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

            {/* Left Panel Toggle */}
            {!isLeftPanelOpen && (
              <button 
                onClick={() => setIsLeftPanelOpen(true)} 
                className="hidden md:flex items-center gap-2 h-10 px-3 bg-indigo-50 text-indigo-600 rounded-lg font-label-md text-[14px] hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                Sidebar
              </button>
            )}

            {/* Properties Panel Toggle */}
            {!isPropertiesPanelOpen && (
              <button 
                onClick={() => setIsPropertiesPanelOpen(true)} 
                className="hidden md:flex items-center gap-2 h-10 px-3 bg-surface-container-high text-on-surface-variant border border-outline-variant/30 rounded-lg font-label-md text-[14px] hover:bg-surface-variant transition-colors shadow-sm cursor-pointer"
              >
                <Settings2 className="w-4 h-4" />
                Properties
              </button>
            )}

            {/* SEO Settings Button */}
            <button 
              onClick={() => setIsSeoModalOpen(true)}
              className="hidden md:flex h-10 px-4 bg-surface-container text-on-surface-variant border border-outline-variant/30 rounded-lg font-label-md text-[14px] hover:bg-surface-variant transition-all shadow-sm items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              SEO Settings
            </button>
            {/* AI Sync Button */}
            <button 
              onClick={handleAutoFill}
              disabled={isSyncing}
              className={`hidden md:flex h-10 px-4 bg-primary-container text-on-primary-container rounded-lg font-label-md text-[14px] hover:bg-primary-container/90 transition-all shadow-sm items-center gap-2 cursor-pointer ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>magic_button</span>
              {isSyncing ? 'Crafting...' : 'Auto-Fill'}
            </button>
            {/* Magic Layout Optimizer Button */}
            <button 
              onClick={() => {
                  import('@/lib/magicLayoutOptimizer').then(({ optimizeLayout }) => {
                      const optimizedBlocks = optimizeLayout(portfolioData);
                      dispatch({
                          type: 'portfolio/updatePortfolioData',
                          payload: {
                              id: portfolioId,
                              data: {
                                  ...portfolioData,
                                  blocks: optimizedBlocks
                              }
                          }
                      });
                      toast.success("Magic Layout Applied!");
                  });
              }}
              className="hidden lg:flex h-10 px-4 bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-label-md text-[14px] hover:bg-purple-200 transition-all shadow-sm items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome_mosaic</span>
              Optimize Layout
            </button>

            {/* SEO Score Button */}
            <button 
              className="h-10 px-4 rounded-lg font-label-md text-[14px] shadow-sm flex items-center gap-2"
              style={{ backgroundColor: seoData.color, color: '#fff' }}
              title={seoData.warnings && seoData.warnings.length > 0 ? seoData.warnings.join('\n') : 'SEO Score Good'}
            >
              SEO Score: {seoData.score}
            </button>
            {/* Publish Button */}
            <button 
              onClick={() => setIsDeployModalOpen(true)}
              className="h-10 px-4 bg-stitch-secondary text-white rounded-lg font-label-md text-[14px] hover:bg-stitch-secondary/90 transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Publish
            </button>
        </GlobalEditorToolbar>

        {/* Pill Tab Switcher (Mobile Only) */}
        <div className="md:hidden w-full bg-surface py-2 px-4 flex justify-center z-40 border-b border-outline-variant/30 shrink-0">
          <div className="flex bg-surface-variant/30 rounded-full p-1 border border-outline-variant/20 relative w-full max-w-sm">
            {['builder', 'preview'].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`flex-1 py-2 rounded-full font-label-md capitalize relative z-10 transition-colors ${
                  view === tab ? 'text-on-primary-container font-bold' : 'text-on-surface-variant'
                }`}
              >
                {view === tab && (
                  <motion.div
                    layoutId="portfolio-active-pill"
                    className="absolute inset-0 bg-primary-container rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Area */}
        <main className="flex-1 flex overflow-hidden bg-surface-container-low relative pt-14 md:pt-16">
          
          {/* 1. Left Sidebar (Tabbed: Sections | AI) */}
          {!isLoading && <LeftSidebar activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} isOpen={isLeftPanelOpen} onToggle={() => setIsLeftPanelOpen(!isLeftPanelOpen)} />}

          {/* 2. Center Preview Canvas */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative items-center justify-center`}>
            
            {/* Device Switcher (Top Center of Canvas) */}
            <div className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-gray-200 dark:border-slate-700 rounded-full p-1 gap-1">
              <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-gray-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`} title="Mobile View"><Smartphone className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-full transition-all ${previewMode === 'tablet' ? 'bg-gray-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`} title="Tablet View"><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-gray-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`} title="Desktop View"><Monitor className="w-4 h-4" /></button>
            </div>

            <div className={`transition-all duration-500 ease-in-out flex flex-col md:rounded-xl overflow-hidden relative mt-10 md:mt-12 ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[2rem] border-[8px] border-surface-container-highest shadow-2xl mx-auto' : previewMode === 'tablet' ? 'w-[768px] h-[1024px] rounded-[1.5rem] border-[8px] border-surface-container-highest shadow-2xl mx-auto' : 'w-full h-full max-w-6xl mx-auto'}`}>
               
               {/* Mobile Only: Tabbed Bottom Sheet Toggle */}
               <div className="md:hidden absolute bottom-4 left-4 right-4 z-50 flex gap-2 justify-center">
                  <button onClick={() => { setIsLeftPanelOpen(true); setIsPropertiesPanelOpen(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg text-sm font-semibold">Menu</button>
                  <button onClick={() => { setIsPropertiesPanelOpen(true); setIsLeftPanelOpen(false); }} className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-lg text-sm font-semibold">Properties</button>
               </div>

               <div className="flex-1 overflow-y-auto bg-background relative w-full h-full custom-scrollbar">
                  {isLoading ? (
                    <div className="p-10 flex flex-col gap-8">
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
                      onOpenAi={() => {
                        setIsLeftPanelOpen(true);
                        // Hack: we don't have direct access to setActiveTab from LeftSidebar here, 
                        // so we can simulate a click on the AI Tab button, or pass a prop to LeftSidebar.
                        // Let's rely on standard LeftSidebar state for now, it's a minor detail.
                      }}
                    />
                  )}
               </div>
            </div>
          </section>

          {/* 3. Right Properties Panel */}
          {!isLoading && <PropertiesPanel activeBlockId={activeBlockId} isOpen={isPropertiesPanelOpen} onToggle={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)} />}
        </main>
        
        <SeoSettingsModal isOpen={isSeoModalOpen} onClose={() => setIsSeoModalOpen(false)} />
        <DeployModal isOpen={isDeployModalOpen} onOpenChange={setIsDeployModalOpen} portfolioId={portfolioId} portfolioData={portfolioData} />
    </motion.div>
    </ErrorBoundary>
  );
}
