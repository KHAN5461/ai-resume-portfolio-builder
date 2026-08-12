import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPortfolio } from '@/store/portfolioSlice';
import PortfolioFormSection from '../../components/PortfolioFormSection';
import PortfolioPreview from '../../components/PortfolioPreview';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function EditPortfolio() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);

  const [view, setView] = useState('builder'); // 'builder' or 'preview'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [isSaving, setIsSaving] = useState(false);

  // On mount, set current portfolio ID to load it into focus
  useEffect(() => {
    if (portfolioId) {
      GlobalApi.GetPortfolioById(portfolioId).then(resp => {
        if (resp.data.data) {
          dispatch({ type: 'portfolio/updatePortfolioData', payload: { id: portfolioId, data: resp.data.data } });
          dispatch(setCurrentPortfolio(portfolioId));
        }
      }).catch(err => {
        toast.error("Failed to load portfolio");
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

  return (
    <ErrorBoundary>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-background text-on-background font-body-md h-screen w-screen overflow-hidden flex flex-col"
    >
        {/* Top Toolbar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant/30 px-gutter h-16 flex items-center justify-between shrink-0 shadow-sm z-20 relative">
          <div className="flex items-center gap-sm">
            <Link to="/dashboard" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}} translate="no">auto_awesome</span>
              <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
            </Link>
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
            {/* Viewport Switcher */}
            <div className="hidden md:flex bg-surface-container-low rounded-lg p-xs">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-md transition-colors flex items-center justify-center ${previewMode === 'desktop' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">desktop_mac</span>
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-md transition-colors flex items-center justify-center ${previewMode === 'mobile' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">smartphone</span>
              </button>
            </div>
            {/* Publish Button */}
            <button 
              onClick={() => {
                setIsSaving(true);
                GlobalApi.UpdatePortfolioDetail(portfolioId, { data: portfolioData })
                  .then(() => {
                    toast.success("Portfolio published successfully!");
                    window.open(`/portfolio/${portfolioId}/view`, '_blank');
                  })
                  .catch(() => toast.error("Failed to publish"))
                  .finally(() => setIsSaving(false));
              }}
              className="h-10 px-4 bg-stitch-secondary text-white rounded-lg font-label-md text-[14px] hover:bg-stitch-secondary/90 transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Publish
            </button>
          </div>
        </header>

        {/* Pill Tab Switcher (Mobile Only) */}
        <div className="md:hidden w-full bg-surface py-sm px-gutter flex justify-center z-40 border-b border-outline-variant/30">
          <div className="flex bg-surface-variant/30 rounded-full p-xs gap-xs border border-outline-variant/20">
            <button 
              className={`px-lg py-sm rounded-full font-label-md text-label-md transition-colors ${view === 'builder' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}
              onClick={() => setView('builder')}
            >
              Builder
            </button>
            <button 
              className={`px-lg py-sm rounded-full font-label-md text-label-md transition-colors ${view === 'preview' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}
              onClick={() => setView('preview')}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Workspace Area */}
        <main className="flex-1 flex overflow-hidden bg-surface-container-low relative">
          
          {/* Left Sidebar: Content Editor (Visible on desktop, or on mobile when 'builder' is selected) */}
          <aside className={`w-full md:w-[420px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 h-full overflow-y-auto flex-col z-10 shadow-[4px_0px_24px_rgba(0,0,0,0.02)] ${view === 'builder' ? 'flex' : 'hidden md:flex'}`}>
            <div className="p-4 flex flex-col flex-1 pb-24 overflow-y-auto custom-scrollbar">
                <PortfolioFormSection />
            </div>
          </aside>

          {/* Right Preview Canvas (Visible on desktop, or on mobile when 'preview' is selected) */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative ${view === 'preview' ? 'flex' : 'hidden md:flex'} items-center justify-center`}>
            <div className={`transition-all duration-500 ease-in-out flex flex-col bg-surface-container-lowest md:rounded-xl md:shadow-lg overflow-hidden md:border border-outline-variant/20 relative ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[2rem] border-[8px] border-surface-container-highest shadow-2xl' : 'w-full h-full'}`}>
               <div className="flex-1 overflow-y-auto bg-background relative w-full h-full custom-scrollbar">
                  <PortfolioPreview />
               </div>
            </div>
          </section>
        </main>
    </motion.div>
    </ErrorBoundary>
  );
}
