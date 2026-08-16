import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPortfolioData } from '@/store/portfolioSlice';
import { generatePortfolioScaffold } from '@/service/AIGenerator';
import { Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function GeneratePortfolioModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [unstructuredData, setUnstructuredData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { portfolioId } = useParams();

  const handleGenerate = async () => {
    if (!prompt.trim() && !unstructuredData.trim()) {
      setError("Please provide either a prompt or some unstructured data to generate from.");
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const scaffoldData = await generatePortfolioScaffold(prompt, unstructuredData);
      
      dispatch(setPortfolioData({
        id: portfolioId,
        data: scaffoldData
      }));
      
      onClose && onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Portfolio Generator</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Let AI scaffold your entire portfolio in seconds.</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2 text-sm border border-red-100 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">1. Creative Intent</label>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'I am a minimalist React developer, keep it clean and dark mode...'"
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">2. Resume Data (Optional)</label>
            <textarea 
              value={unstructuredData}
              onChange={(e) => setUnstructuredData(e.target.value)}
              placeholder="Paste your raw LinkedIn dump, old resume text, or bio here..."
              className="w-full h-32 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none custom-scrollbar dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt.trim() && !unstructuredData.trim())}
            className="relative px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 overflow-hidden"
          >
            {isGenerating && (
              <div className="absolute inset-0 bg-indigo-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="ml-2 text-sm font-medium">Synthesizing...</span>
              </div>
            )}
            <Bot className="w-4 h-4" />
            Generate Portfolio
          </button>
        </div>

      </div>
    </div>
  );
}
