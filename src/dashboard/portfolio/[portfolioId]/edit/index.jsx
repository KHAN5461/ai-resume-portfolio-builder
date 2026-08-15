import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPortfolio } from '@/store/portfolioSlice';
import { ActionCreators } from 'redux-undo';
import useUndoRedoKeyboard from '@/hooks/useUndoRedoKeyboard';
import PortfolioFormSection from '../../components/PortfolioFormSection';
import PortfolioPreview from '../../components/PortfolioPreview';
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
import { Undo2, Redo2 } from 'lucide-react';

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
        <header 
          className="bg-surface-container-lowest border-b border-t-4 border-t-purple-500 border-outline-variant/30 px-gutter h-16 flex items-center justify-between shrink-0 shadow-sm z-20 relative transition-transform duration-300"
          style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="flex items-center gap-sm">
            <Link to="/dashboard" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}} translate="no">auto_awesome</span>
              <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
            </Link>
            <div className="mx-2 flex items-center">
              <ResponsiveBreadcrumbs paths={[{label: 'Dashboard', href: '/dashboard'}, {label: 'Portfolio Editor', href: '#'}]} />
            </div>
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div 
                  key="saving"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="ml-sm px-3 py-1.5 bg-primary-container text-on-primary-container rounded-full font-label-sm flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px] animate-spin" translate="no">sync</span> Saving...
                </motion.div>
              ) : (
                <motion.div 
                  key="saved"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="ml-sm px-3 py-1.5 bg-surface-container-highest text-on-surface-variant rounded-full font-label-sm flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#34A853]" translate="no">check_circle</span> Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-md">
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
            {/* Viewport Switcher */}
            <div className="hidden md:flex bg-surface-container-low rounded-lg p-xs">
              <button 
                aria-label="Desktop preview"
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-md transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stitch-primary ${previewMode === 'desktop' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">desktop_mac</span>
              </button>
              <button 
                aria-label="Mobile preview"
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-md transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stitch-primary ${previewMode === 'mobile' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">smartphone</span>
              </button>
            </div>
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
          </div>
        </header>

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
        <main className="flex-1 flex overflow-hidden bg-surface-container-low relative">
          
          {/* Left Sidebar: Content Editor (Visible on desktop, or on mobile when 'builder' is selected) */}
          <aside className={`w-full md:w-[420px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 h-full overflow-y-auto flex-col z-10 shadow-[4px_0px_24px_rgba(0,0,0,0.02)] ${view === 'builder' ? 'flex' : 'hidden md:flex'}`}>
            <div ref={scrollRef} className="p-4 flex flex-col flex-1 pb-24 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <PortfolioFormSection />
                )}
            </div>
          </aside>

          {/* Right Preview Canvas (Visible on desktop, or on mobile when 'preview' is selected) */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative ${view === 'preview' ? 'flex' : 'hidden md:flex'} items-center justify-center`}>
            <div className={`transition-all duration-500 ease-in-out flex flex-col bg-surface-container-lowest md:rounded-xl md:shadow-lg overflow-hidden md:border border-outline-variant/20 relative ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[2rem] border-[8px] border-surface-container-highest shadow-2xl' : 'w-full h-full'}`}>
               <div className="flex-1 overflow-y-auto bg-background relative w-full h-full custom-scrollbar">
                  {isLoading ? (
                    <div className="p-10 flex flex-col gap-8">
                      <Skeleton className="h-64 w-full rounded-xl" />
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                  ) : (
                    <PortfolioPreview />
                  )}
               </div>
            </div>
          </section>
        </main>
        
        <SeoSettingsModal isOpen={isSeoModalOpen} onClose={() => setIsSeoModalOpen(false)} />
        <DeployModal isOpen={isDeployModalOpen} onOpenChange={setIsDeployModalOpen} portfolioId={portfolioId} portfolioData={portfolioData} />
    </motion.div>
    </ErrorBoundary>
  );
}
