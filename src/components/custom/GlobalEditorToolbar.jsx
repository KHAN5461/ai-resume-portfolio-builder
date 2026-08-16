import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download, Eye, Edit, CloudCog, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GlobalEditorToolbar({ 
  view, 
  setView, 
  onSave, 
  onExport, 
  mode = "resume", 
  title = "Editor",
  children
}) {
  const isSaving = useSelector((state) => state.sync.isSaving);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 md:px-6">
      {/* Left: Navigation & Meta */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
            {mode === 'portfolio' ? 'Portfolio' : 'Resume'}
          </span>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[150px] md:max-w-[200px]">{title}</h1>
        </div>
      </div>

      {/* Center: Modes (Removed to simplify Header) */}
      <div className="hidden md:flex"></div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          {isSaving ? (
             <>
               <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
               <span className="opacity-70">Syncing...</span>
             </>
          ) : (
             <>
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span>Synced</span>
             </>
          )}
        </div>
        
        {/* Child action buttons (Undo, AI toggle, SEO, etc) */}
        <div className="flex items-center gap-2">
          {children}
        </div>

        {/* Primary Export Dropdown */}
        <div className="relative group">
          <button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
            Export <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-gray-100 dark:border-slate-800 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {mode === 'portfolio' ? (
              <>
                 <button onClick={onSave} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Publish</button>
                 <button onClick={onSave} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Deploy Source</button>
              </>
            ) : (
               <button onClick={onExport} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Download PDF
               </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
