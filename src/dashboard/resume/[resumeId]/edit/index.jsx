import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ThemeBuilder from '../../components/ThemeBuilder';
import ResumePreview from '../../components/ResumePreview';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AtsScoreRing } from '../../components/AtsScoreRing';
import { ExportModal } from '../../components/ExportModal';
import { AtsRoastPanel } from '../../components/AtsRoastPanel';
import RawJsonEditor from '../../components/RawJsonEditor';
import MagicImportModal from '../../components/MagicImportModal';
import { AiCoPilot } from '../../components/AiCoPilot';
import { Languages, Flame, MessageSquare } from 'lucide-react';

function EditResume() {
    const {resumeId}=useParams();
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [activeTab, setActiveTab] = useState('Content');
    const [view, setView] = useState('builder'); // 'builder' or 'preview'
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAtsPanelOpen, setIsAtsPanelOpen] = useState(false);
    const [viewport, setViewport] = useState('desktop');
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error', 'unsaved'
    const [isZenMode, setIsZenMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    
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
        GlobalApi.GetResumeById(resumeId).then(resp=>{
          dispatch(setResumeData(resp.data.data));
        }).catch(err => {
          toast.error("Failed to load resume data");
        })
    }

    // Auto-Save Effect
    useEffect(() => {
      // Skip initial load
      if (!resumeInfo || Object.keys(resumeInfo).length === 0) return;
      
      setSaveStatus('unsaved');
      
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        GlobalApi.UpdateResumeDetail(resumeId, { data: resumeInfo })
          .then(() => {
            setSaveStatus('saved');
          })
          .catch(() => {
            setSaveStatus('error');
            toast.error('Auto-save failed. Please check your connection.');
          });
      }, 2000); // 2 second debounce

      return () => clearTimeout(timer);
    }, [resumeInfo, resumeId]);

    const handleTranslate = () => {
        toast.info("Translating resume to French...");
        setTimeout(() => {
            toast.success("Resume translated successfully! (Mock)");
        }, 1500);
    };

  return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-background text-on-background font-body-md h-screen w-screen overflow-hidden flex flex-col"
      >
        {/* Top Toolbar */}
        <header className="bg-surface/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 px-gutter h-16 flex items-center justify-between shrink-0 shadow-sm z-20 relative">
          <div className="flex items-center gap-sm">
            <Link to="/dashboard" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4 ml-8">
              <span className="px-2 py-1 bg-surface-container-highest rounded-md font-label-sm text-[12px] text-on-surface-variant flex items-center gap-xs">
                Draft - {resumeInfo?.title || 'Loading...'}
              </span>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
                      <div className="h-full bg-stitch-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="font-label-sm text-[12px] text-on-surface-variant w-8">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-md">
            
            {/* Save Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant/30 border border-outline-variant/20 mr-2">
              {saveStatus === 'saved' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-green-500">cloud_done</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Saved to Cloud</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-stitch-primary animate-pulse">cloud_sync</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Saving...</span>
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-yellow-500">edit_note</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Unsaved changes</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="material-symbols-outlined text-[16px] text-red-500">cloud_off</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Save Failed</span>
                </>
              )}
            </div>

            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <MagicImportModal renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="hover:scale-105 transition-transform cursor-pointer bg-stitch-primary/10 text-stitch-primary p-2 rounded-full flex items-center justify-center"
                  title="Magic Import"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_fix_high</span>
                </button>
              )} />
              <button 
                onClick={handleTranslate}
                className="hover:scale-105 transition-transform cursor-pointer text-on-surface-variant hover:text-stitch-primary bg-surface-container-highest p-2 rounded-full flex items-center justify-center"
                title="Translate Resume"
              >
                <Languages className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsAtsPanelOpen(true)}
                className="hover:scale-105 transition-transform cursor-pointer bg-red-500/10 text-red-500 px-4 py-2 rounded-full flex items-center justify-center gap-2 font-label-md font-bold"
                title="Roast My Resume"
              >
                <Flame className="w-5 h-5" /> Roast Resume
              </button>
              <button 
                onClick={() => setIsExportOpen(true)}
                className="h-10 px-6 bg-indigo-600 text-white rounded-xl font-label-md text-[14px] hover:bg-indigo-500 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                Launch
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
              
              <div className="p-4 flex flex-col flex-1 pb-24 overflow-y-auto custom-scrollbar">
                {activeTab === 'Content' && <FormSection />}
                {activeTab === 'Theme' && <ThemeBuilder />}
                {activeTab === 'Settings' && <div className="flex-1 mt-4"><RawJsonEditor /></div>}
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
                <button onClick={() => setViewport('desktop')} className={`w-7 h-7 rounded-md ${viewport === 'desktop' ? 'bg-white shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'} transition-colors flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-[16px]">desktop_mac</span>
                </button>
                <button onClick={() => setViewport('mobile')} className={`w-7 h-7 rounded-md ${viewport === 'mobile' ? 'bg-white shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary'} transition-colors flex items-center justify-center`}>
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
                onClick={() => setIsZenMode(!isZenMode)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isZenMode ? 'bg-stitch-primary/10 text-stitch-primary' : 'text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant'}`}
                title="Zen Mode"
              >
                <span className="material-symbols-outlined text-[18px]">{isZenMode ? 'fullscreen_exit' : 'fullscreen'}</span>
              </button>
              <Link to={'/my-resume/'+resumeId+"/view"} target="_blank" className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant transition-colors" title="Open in new tab">
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
                 <div 
                    className={`bg-white w-[210mm] min-h-[297mm] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 flex-shrink-0 mt-4 break-words transition-all duration-300 origin-top`}
                    style={{ transform: `scale(${viewport === 'mobile' ? zoom * 0.5 : zoom})`, marginBottom: `${(zoom - 1) * 297}mm` }}
                 >
                    <ResumePreview />
                 </div>
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

      {/* Mobile Chat-to-Build Override */}
      <div className="md:hidden fixed inset-0 z-[100] bg-surface flex flex-col pt-16">
        <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center shadow-sm z-10">
            <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">Mobile AI Builder</h3>
                <p className="font-label-sm text-[11px] text-on-surface-variant">Chat to build your resume</p>
            </div>
            <Link to="/dashboard" className="w-8 h-8 rounded-full bg-surface-variant/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-surface-container-lowest">
            <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stitch-primary to-purple-500 text-white shrink-0 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                </div>
                <div className="p-3 rounded-2xl font-body-sm text-[14px] shadow-sm bg-surface text-on-surface border border-outline-variant/20 rounded-tl-none leading-relaxed">
                    Welcome to the mobile builder! Editing a canvas on a phone is tough, so let's just chat. What is your current job title?
                </div>
            </div>
        </div>
        <div className="p-4 bg-surface border-t border-outline-variant/20 mb-safe pb-8">
            <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="E.g., Software Engineer at Google..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full pl-4 pr-12 py-3 font-body-sm text-[14px] text-on-surface focus:outline-none focus:border-stitch-primary shadow-sm"
                />
                <button className="absolute right-2 w-8 h-8 bg-stitch-primary text-white rounded-full flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[16px] -ml-0.5" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                </button>
            </div>
        </div>
      </div>
      </motion.div>
  )
}

export default EditResume