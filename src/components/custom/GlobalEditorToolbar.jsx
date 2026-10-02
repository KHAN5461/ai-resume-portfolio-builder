import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download, Eye, Edit, CloudCog, ChevronDown, Code2, FileArchive, CheckCircle2, RotateCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExportModal from '@/dashboard/portfolio/components/ExportModal';
import { downloadPortfolioZip } from '@/lib/codeExporter';
import { toast } from 'sonner';

export default function GlobalEditorToolbar({ 
  view, 
  setView, 
  onSave, 
  onExport, 
  onAddNew,
  mode = "resume", 
  title = "Editor",
  portfolioData,
  children
}) {
  const syncStatus = useSelector((state) => state.sync.syncStatus);
  const pendingQueueLength = useSelector((state) => state.sync.pendingQueueLength || 0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Don't show header in editor tab ('builder') and preview tab ('preview') on mobile screen
  const hideOnMobile = view === 'builder' || view === 'preview';

  return (
    <header className={`fixed top-0 left-0 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 z-50 items-center justify-between px-3 md:px-6 shadow-sm select-none ${hideOnMobile ? 'hidden md:flex' : 'flex'}`}>
      {/* Left: Navigation & Meta */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Link 
          to="/dashboard"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs shrink-0 cursor-pointer"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col min-w-0">
          <Link 
            to="/dashboard" 
            className="text-[9px] uppercase font-bold text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 tracking-widest leading-none mb-1 transition-colors flex items-center gap-1"
            title="Back to Dashboard"
          >
            <span>{mode === 'portfolio' ? 'Portfolio Workspace' : 'Resume Workspace'}</span>
          </Link>
          <h1 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[180px] xs:max-w-[220px] sm:max-w-[280px] md:max-w-[340px]">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Spare Area / Future Navigation */}
      <div className="hidden lg:flex"></div>

      {/* Right: Actions & Plus Button at Right End */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 md:gap-3">
        {/* Sync Status Telemetry */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-3 mr-1">
          {syncStatus === 'saving' ? (
            <>
              <RotateCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Saving...</span>
            </>
          ) : syncStatus === 'offline-queued' ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <span>Saved locally ({pendingQueueLength})</span>
            </>
          ) : syncStatus === 'unsaved' ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
              <span>Editing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved to cloud</span>
            </>
          )}
        </div>
        

        {/* Primary Export Dropdown */}
        <div className="relative group shrink-0">
          <button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3.5 md:px-4.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-transparent active:scale-[0.98]">
            <span>Export</span> 
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right group-hover:translate-y-0 translate-y-1 z-50">
            {mode === 'portfolio' ? (
              <>
                <button 
                  onClick={onSave} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Publish Changes
                </button>
                <button 
                  onClick={onSave} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Deploy Live
                </button>
                <button 
                  onClick={() => setIsExportModalOpen(true)} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80"
                >
                  <Code2 size={13} className="text-slate-400" /> 
                  <span>Export React Code</span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      toast.loading("Generating ZIP file...", { id: "zip" });
                      await downloadPortfolioZip(portfolioData);
                      toast.success("Download started!", { id: "zip" });
                    } catch (e) {
                      toast.error("Failed to generate ZIP.", { id: "zip" });
                    }
                  }} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 text-indigo-600 dark:text-indigo-400 font-bold"
                >
                  <FileArchive size={13} /> 
                  <span>Download ZIP</span>
                </button>
              </>
            ) : (
              <button 
                onClick={onExport} 
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                <Download className="w-3.5 h-3.5" /> 
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
        </div>

        {/* Plus Button - hidden in desktop mode */}
        {onAddNew && (
          <button
            onClick={onAddNew}
            aria-label={mode === 'portfolio' ? 'Create new portfolio' : 'Create new resume'}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-all active:scale-[0.93] border border-indigo-200/30 dark:border-indigo-900/30 cursor-pointer shrink-0"
            title={mode === 'portfolio' ? 'Create New Portfolio' : 'Create New Resume'}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Render Modal */}
      {mode === 'portfolio' && (
        <ExportModal 
          isOpen={isExportModalOpen} 
          onClose={() => setIsExportModalOpen(false)} 
          portfolioData={portfolioData} 
        />
      )}
    </header>
  );
}
