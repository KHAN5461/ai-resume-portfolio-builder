import React, { useState } from 'react';
import { Copy, Check, Terminal, X } from 'lucide-react';
import { generatePortfolioReactCode } from '../../../lib/codeExporter';

export default function ExportModal({ isOpen, onClose, portfolioData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reactCodeString = generatePortfolioReactCode(portfolioData);

  const handleCopy = () => {
    navigator.clipboard.writeText(reactCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Terminal size={16} className="text-indigo-400" /> Export React Component Code
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed custom-scrollbar">
          <pre>{reactCodeString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-500">Ready to drop into any Vite, Next.js, or React project using Tailwind CSS.</span>
          <button 
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {copied ? <><Check size={14} className="text-emerald-400" /> Copied to Clipboard</> : <><Copy size={14} /> Copy JSX Code</>}
          </button>
        </div>

      </div>
    </div>
  );
}
