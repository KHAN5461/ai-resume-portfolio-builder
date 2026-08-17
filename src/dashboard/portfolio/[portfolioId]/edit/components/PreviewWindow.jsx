import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Code2, Eye } from 'lucide-react';

export default function PreviewWindow({ children, rawCode }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // Device width mapping for responsive container scaling
  const deviceWidthClass = {
    desktop: 'max-w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  }[device];

  return (
    <div className="flex flex-col size-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 py-2 select-none relative z-50">
        
        {/* Left: Preview / Code Toggle */}
        <div className="inline-flex items-center gap-0.5 bg-slate-100/60 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Eye size={13} /> Preview
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'code' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Code2 size={13} /> Code
          </button>
        </div>

        {/* Right: Device Viewport Switcher (Only visible in Preview mode) */}
        {viewMode === 'preview' && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor size={15} />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet size={15} />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Canvas Viewport Body */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center transition-all duration-300">
        {viewMode === 'preview' ? (
          <div className={`h-full w-full ${deviceWidthClass} transition-all duration-300 bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 overflow-hidden`}>
            {children}
          </div>
        ) : (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950 p-6 overflow-auto font-mono text-xs text-indigo-600 dark:text-indigo-300 text-left">
            <pre className="whitespace-pre-wrap">{rawCode || "// No JSON data available"}</pre>
          </div>
        )}
      </div>

    </div>
  );
}
