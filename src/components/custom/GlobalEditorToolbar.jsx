import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download, Eye, Edit, CloudCog } from 'lucide-react';
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
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </Link>
        <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block"></div>
        <h1 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px] md:max-w-xs">{title}</h1>
      </div>

      {/* Center: View Toggle */}
      <div className="hidden md:flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        <button 
          onClick={() => setView('builder')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view !== 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setView('preview')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Live Preview
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {isSaving ? (
             <span className="flex items-center gap-1 opacity-70"><CloudCog className="w-3.5 h-3.5 animate-pulse" /> Syncing...</span>
          ) : (
             <span className="flex items-center gap-1"><CloudCog className="w-3.5 h-3.5" /> All changes saved</span>
          )}
        </div>
        
        {/* Child action buttons (Undo, AI toggle, SEO, etc) */}
        <div className="flex items-center gap-2">
          {children}
        </div>

        {mode === 'portfolio' ? (
          <button onClick={onSave} className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
             Deploy
          </button>
        ) : (
          <button onClick={onExport} className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
             <Download className="w-4 h-4" /> Export
          </button>
        )}
      </div>
    </header>
  );
}
