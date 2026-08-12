import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ThemeBuilder from '../../components/ThemeBuilder';
import ResumePreview from '../../components/ResumePreview';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AtsScoreRing } from '../../components/AtsScoreRing';
import { ExportModal } from '../../components/ExportModal';
import { AtsRoastPanel } from '../../components/AtsRoastPanel';
import RawJsonEditor from '../../components/RawJsonEditor';

function EditResume() {
    const {resumeId}=useParams();
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [activeTab, setActiveTab] = useState('Content');
    const [view, setView] = useState('builder'); // 'builder' or 'preview'
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAtsPanelOpen, setIsAtsPanelOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error', 'unsaved'

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

  return (
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
              <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
            </Link>
            <span className="ml-sm px-2 py-1 bg-surface-container-highest rounded-md font-label-sm text-[12px] text-on-surface-variant hidden md:flex items-center gap-xs">
              Draft - {resumeInfo?.title || 'Loading...'}
            </span>
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

            {/* Viewport Switcher */}
            <div className="hidden md:flex bg-surface-container-low rounded-lg p-xs">
              <button className="p-2 rounded-md bg-surface shadow-sm text-stitch-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">desktop_mac</span>
              </button>
              <button className="p-2 rounded-md text-on-surface-variant hover:text-stitch-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smartphone</span>
              </button>
            </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAtsPanelOpen(true)}
                className="hover:scale-105 transition-transform cursor-pointer"
                title="Open ATS Copilot"
              >
                <AtsScoreRing />
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
          <aside className={`w-full md:w-[420px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 h-full overflow-y-auto flex-col z-10 shadow-[4px_0px_24px_rgba(0,0,0,0.02)] ${view === 'builder' ? 'flex' : 'hidden md:flex'}`}>
            {/* Editor Tabs */}
            <div className="flex border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest z-10 shrink-0">
              <button onClick={() => setActiveTab('Content')} className={`flex-1 py-3 text-center border-b-2 font-label-md text-[14px] transition-colors ${activeTab === 'Content' ? 'border-stitch-primary text-stitch-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-stitch-primary'}`}>Content</button>
              <button onClick={() => setActiveTab('Theme')} className={`flex-1 py-3 text-center border-b-2 font-label-md text-[14px] transition-colors ${activeTab === 'Theme' ? 'border-stitch-primary text-stitch-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-stitch-primary'}`}>Theme</button>
              <button onClick={() => setActiveTab('Settings')} className={`flex-1 py-3 text-center border-b-2 font-label-md text-[14px] transition-colors ${activeTab === 'Settings' ? 'border-stitch-primary text-stitch-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-stitch-primary'}`}>Settings</button>
            </div>
            
            <div className="p-4 flex flex-col flex-1 pb-24 overflow-y-auto custom-scrollbar">
               {activeTab === 'Content' && <FormSection />}
               {activeTab === 'Theme' && <ThemeBuilder />}
               {activeTab === 'Settings' && <div className="flex-1 mt-4"><RawJsonEditor /></div>}
            </div>
          </aside>

          {/* Right Preview Canvas */}
          <section className={`h-full flex-1 overflow-hidden flex-col bg-surface-container p-0 md:p-6 relative ${view === 'preview' ? 'flex' : 'hidden md:flex'}`}>
            {/* Canvas Controls Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-4 border border-outline-variant/20">
              <span className="font-label-sm text-[12px] text-on-surface-variant">Live Preview</span>
              <div className="w-px h-4 bg-outline-variant"></div>
              <button className="text-stitch-primary hover:text-primary-container transition-colors" title="Refresh Preview">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <Link to={'/my-resume/'+resumeId+"/view"} target="_blank" className="text-on-surface-variant hover:text-stitch-primary transition-colors" title="Open in new tab">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </div>

            {/* Clean A4 Canvas */}
            <div className="w-full h-full flex flex-col bg-surface-container overflow-hidden pt-16 pb-10">
              <div className="flex-1 overflow-y-auto w-full h-full custom-scrollbar flex justify-center pb-8">
                 <div className="bg-white w-[210mm] min-h-[297mm] shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-outline-variant/30 flex-shrink-0 mt-4 break-words">
                    <ResumePreview />
                 </div>
              </div>
            </div>
          </section>
        </main>
      </motion.div>
  )
}

export default EditResume