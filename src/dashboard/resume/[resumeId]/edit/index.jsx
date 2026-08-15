import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ThemeBuilder from '../../components/ThemeBuilder';
import ResumePreview from '../../components/ResumePreview';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
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
import { AiCoPilot } from '../../components/AiCoPilot';
import { Languages, Flame, MessageSquare, Undo2, Redo2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useScrollIntoViewOnFocus from '@/hooks/useScrollIntoViewOnFocus';
import ResponsiveBreadcrumbs from '@/components/custom/ResponsiveBreadcrumbs';
import useHideOnScroll from '@/hooks/useHideOnScroll';

function EditResume() {
    const {resumeId}=useParams();
    useScrollIntoViewOnFocus();
    useUndoRedoKeyboard();
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
    const pastStates = useSelector(state => state.resume.past);
    const futureStates = useSelector(state => state.resume.future);
    const [activeTab, setActiveTab] = useState('Content');
    const [view, setView] = useState('builder'); // 'builder' or 'preview'
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAtsPanelOpen, setIsAtsPanelOpen] = useState(false);
    const [viewport, setViewport] = useState('desktop');
    const syncStatus = useSelector(state => state.sync.syncStatus);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    
    const scrollRef = React.useRef(null);
    const isVisible = useHideOnScroll(scrollRef);
    
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
        GetResumeInfo();
    },[])

    const GetResumeInfo=()=>{
        setIsLoading(true);
        GlobalApi.GetResumeById(resumeId).then(resp=>{
          dispatch(setResumeData(resp.data.data));
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
        <header 
          className="bg-surface/70 backdrop-blur-md border-b border-t-4 border-t-stitch-primary border-white/20 dark:border-white/10 px-gutter h-16 flex items-center justify-between shrink-0 shadow-sm z-20 relative transition-transform duration-300"
          style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="flex items-center gap-sm">
            <Link to="/dashboard" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
            </Link>
            <div className="mx-2 flex items-center">
              <ResponsiveBreadcrumbs paths={[{label: 'Dashboard', href: '/dashboard'}, {label: 'Resume Editor', href: '#'}]} />
            </div>
            
            <div className="hidden md:flex items-center gap-4 ml-8">
              <span className="px-2 py-1 bg-surface-container-highest rounded-md font-label-sm text-[12px] text-on-surface-variant flex items-center gap-xs">
                Draft - {resumeInfo?.title || 'Loading...'}
              </span>
              
            </div>
          </div>
          <div className="flex items-center gap-md">
            
            {/* Save Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant/30 border border-outline-variant/20 mr-2">
              {syncStatus === 'saved' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-green-500">cloud_done</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Saved to Cloud</span>
                </>
              )}
              {syncStatus === 'saving' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-stitch-primary animate-pulse">cloud_sync</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Saving...</span>
                </>
              )}
              {syncStatus === 'unsaved' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-yellow-500">edit_note</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Unsaved changes</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-red-500">cloud_off</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Save Failed</span>
                </>
              )}
              {syncStatus === 'offline-queued' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-orange-500">wifi_off</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Queued offline</span>
                </>
              )}
            </div>

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
            {/* Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2">
              <MagicImportModal renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="w-10 h-10 hover:bg-surface-variant transition-colors cursor-pointer text-on-surface-variant hover:text-stitch-primary rounded-full flex items-center justify-center group"
                  title="Magic Import"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform" style={{fontVariationSettings: "'FILL' 0"}}>auto_fix_high</span>
                </button>
              )} />

              <button 
                onClick={() => setIsAtsPanelOpen(true)}
                className="w-10 h-10 hover:bg-red-50 transition-colors cursor-pointer text-on-surface-variant hover:text-red-500 rounded-full flex items-center justify-center group"
                title="Roast Resume"
              >
                <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <Link 
                to={`/interview/${resumeId}`}
                className="w-10 h-10 hover:bg-blue-50 transition-colors cursor-pointer text-on-surface-variant hover:text-blue-500 rounded-full flex items-center justify-center group mr-2 md:mr-4"
                title="Interview Coach"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsExportOpen(true)}
                className="h-10 px-6 bg-stitch-primary text-white rounded-full font-label-md text-[14px] hover:bg-stitch-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                Export
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
        </header>

        <ExportModal 
          isOpen={isExportOpen} 
          onOpenChange={setIsExportOpen} 
          resumeInfo={resumeInfo} 
        />

        <AtsRoastPanel 
          isOpen={isAtsPanelOpen}
          onClose={() => setIsAtsPanelOpen(false)}
        />

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
                    layoutId="resume-active-pill"
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
        <main className="flex-1 flex overflow-hidden bg-surface-container-low">
          {/* Left Sidebar: Content Editor */}
          {!isZenMode && (
            <aside className={`w-full md:w-[420px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 h-full overflow-y-auto flex-col z-10 shadow-[4px_0px_24px_rgba(0,0,0,0.02)] transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-[420px]'} ${view === 'builder' ? 'flex' : 'hidden md:flex'}`}>
              
              {/* Header area of sidebar with toggle */}
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest z-10">
                 {/* Segmented Control Tabs */}
                 <div className="flex bg-surface-container-low rounded-lg p-1 w-full gap-1 border border-outline-variant/20">
                    <button onClick={() => setActiveTab('Content')} className={`flex-1 py-1.5 rounded-md text-center font-label-md text-[13px] transition-all ${activeTab === 'Content' ? 'bg-white shadow-sm text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Content</button>
                    <button onClick={() => setActiveTab('Theme')} className={`flex-1 py-1.5 rounded-md text-center font-label-md text-[13px] transition-all ${activeTab === 'Theme' ? 'bg-white shadow-sm text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Theme</button>
                    <button onClick={() => setActiveTab('Settings')} className={`flex-1 py-1.5 rounded-md text-center font-label-md text-[13px] transition-all ${activeTab === 'Settings' ? 'bg-white shadow-sm text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Settings</button>
                 </div>
              </div>
              
              <div ref={scrollRef} className="p-4 flex flex-col flex-1 pb-24 overflow-y-auto custom-scrollbar">
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
                  </>
                )}
              </div>
            </aside>
          )}

          {/* Right Preview Canvas */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}>
            {/* Canvas Controls Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-surface/90 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 border border-white/60 dark:border-white/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
              
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
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} 
                  className="text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant w-6 h-6 rounded flex items-center justify-center transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="font-label-sm text-[12px] w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))} 
                  className="text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant w-6 h-6 rounded flex items-center justify-center transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>

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
            </div>

            {/* Clean A4 Canvas */}
            <div 
              className="w-full h-full flex flex-col bg-surface-container overflow-hidden pt-16 pb-10"
              onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ show: true, x: e.pageX, y: e.pageY });
              }}
              onClick={() => setContextMenu({ show: false, x: 0, y: 0 })}
            >
              <div className={`flex-1 overflow-y-auto w-full h-full custom-scrollbar flex ${viewport === 'mobile' ? 'justify-center items-start' : 'justify-center'} pb-8 transition-all`}>
                 {isLoading ? (
                    <div className={`bg-white w-[210mm] min-h-[297mm] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 flex-shrink-0 mt-4 break-words transition-all duration-300 origin-top p-10 flex flex-col gap-6`} style={{ transform: `scale(${viewport === 'mobile' ? zoom * 0.5 : zoom})`, marginBottom: `${(zoom - 1) * 297}mm` }}>
                      <Skeleton className="h-32 w-full rounded-none" />
                      <Skeleton className="h-12 w-3/4 rounded-none" />
                      <Skeleton className="h-8 w-full rounded-none" />
                      <Skeleton className="h-64 w-full rounded-none" />
                    </div>
                  ) : (
                    <div 
                        className={`bg-white w-[210mm] min-h-[297mm] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 flex-shrink-0 mt-4 break-words transition-all duration-300 origin-top`}
                        style={{ transform: `scale(${viewport === 'mobile' ? zoom * 0.5 : zoom})`, marginBottom: `${(zoom - 1) * 297}mm` }}
                    >
                        <ResumePreview />
                    </div>
                  )}
              </div>
            </div>

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
        </main>
      
      {/* Persistent AI Co-Pilot (Desktop) */}
      <div className="hidden md:block">
        <AiCoPilot />
      </div>


      </motion.div>
  )
}

export default EditResume