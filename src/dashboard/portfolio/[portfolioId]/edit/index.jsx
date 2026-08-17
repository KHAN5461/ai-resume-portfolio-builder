import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPortfolio } from '@/store/portfolioSlice';
import { ActionCreators } from 'redux-undo';
import useUndoRedoKeyboard from '@/hooks/useUndoRedoKeyboard';
import BlockPalette from '../../components/BlockPalette';
import CanvasArea from '../../components/CanvasArea';
import PropertiesPanel from '../../components/PropertiesPanel';
import LeftSidebar from '../../components/LeftSidebar';
import GenerativeCanvasLoader from '../../components/GenerativeCanvasLoader';
import PreviewWindow from './components/PreviewWindow';
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBlockId, setActiveBlockId] = useState('hero');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);

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

  // AI Generation Workflow
  useEffect(() => {
    if (!isGenerating || !portfolioId || isLoading) return;

    const runGeneration = async () => {
      try {
        const prompt = `
          You are an expert portfolio architect. Based on this creative brief, generate a complete portfolio data payload.
          
          Creative Brief: "${aiPrompt}"
          
          Return ONLY valid JSON matching this exact structure:
          {
            "heroSection": {
              "greeting": "Hi, I'm [Name]",
              "headline": "A punchy 3-5 word professional title",
              "subheadline": "A compelling 1-2 sentence value proposition"
            },
            "aboutSection": {
              "bioTitle": "About Me",
              "bioDescription": "A conversational 2-3 paragraph biography."
            },
            "skillsSection": {
              "categories": [
                { "categoryName": "Category", "skills": ["Skill1", "Skill2"] }
              ]
            },
            "contactSection": {
              "heading": "Get In Touch",
              "subheading": "A friendly invitation message.",
              "email": "hello@example.com"
            }
          }
        `;

        const result = await AIChatSession.sendMessage(prompt);
        const rawText = result.response.text();
        const cleanedJSON = JSON.parse(rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim());

        dispatch({
          type: 'portfolio/updatePortfolioData',
          payload: {
            id: portfolioId,
            data: cleanedJSON
          }
        });

        // Exit generation mode
        setIsGenerating(false);
        setIsPropertiesPanelOpen(true);
        setSearchParams({}, { replace: true });

        toast('✨ AI generated your portfolio.', {
          action: {
            label: 'Undo',
            onClick: () => {
              dispatch(ActionCreators.undo());
              toast.info('Reverted AI generation.');
            },
          },
        });
      } catch (error) {
        console.error('AI Generation failed:', error);
        toast.error('Failed to synthesize portfolio. Please try again.');
        setIsGenerating(false);
        setIsPropertiesPanelOpen(true);
        setSearchParams({}, { replace: true });
      }
    };

    // Hide right panel during generation
    setIsPropertiesPanelOpen(false);
    runGeneration();
  }, [isGenerating, portfolioId, isLoading]);

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
          onSave={() => setIsDeployModalOpen(true)}
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
          <main className="flex-1 relative flex flex-col overflow-hidden bg-slate-950 p-4 md:p-6">
            <PreviewWindow rawCode={JSON.stringify(portfolioData, null, 2)}>
               {/* Mobile Only: Tabbed Bottom Sheet Toggle */}
               <div className="md:hidden absolute bottom-4 left-4 right-4 z-50 flex gap-2 justify-center">
                  <button onClick={() => { setIsLeftPanelOpen(true); setIsPropertiesPanelOpen(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg text-sm font-semibold">Menu</button>
                  <button onClick={() => { setIsPropertiesPanelOpen(true); setIsLeftPanelOpen(false); }} className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-lg text-sm font-semibold">Properties</button>
               </div>

               <div className="flex-1 overflow-y-auto bg-background relative w-full h-full custom-scrollbar">
                  {isGenerating && <GenerativeCanvasLoader />}
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
                      }}
                    />
                  )}
               </div>
            </PreviewWindow>
          </main>

          {/* 3. Right Properties Panel */}
          {!isLoading && !isGenerating && <PropertiesPanel activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} isOpen={isPropertiesPanelOpen} onToggle={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)} />}
        </main>
        
        <SeoSettingsModal isOpen={isSeoModalOpen} onClose={() => setIsSeoModalOpen(false)} />
        <DeployModal isOpen={isDeployModalOpen} onOpenChange={setIsDeployModalOpen} portfolioId={portfolioId} portfolioData={portfolioData} />
    </motion.div>
    </ErrorBoundary>
  );
}
