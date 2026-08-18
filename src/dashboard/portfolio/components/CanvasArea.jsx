import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PortfolioNav from '../../../portfolio/components/PortfolioNav';
import PortfolioFooter from '../../../portfolio/components/PortfolioFooter';
import GeneratePortfolioModal from './GeneratePortfolioModal';

import ModernTemplate from '../../../portfolio/templates/ModernTemplate';
import MinimalistTemplate from '../../../portfolio/templates/MinimalistTemplate';
import CreativeTemplate from '../../../portfolio/templates/CreativeTemplate';
import BentoTemplate from '../../../portfolio/templates/BentoTemplate';

export default function CanvasArea({ portfolioData }) {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);

  // If completely blank, show blank canvas generator
  if (!portfolioData || Object.keys(portfolioData).length === 0 || (!portfolioData.heroSection && !portfolioData.siteConfig?.layout?.length)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col items-center justify-center gap-6 p-10">
          <div className="w-full max-w-4xl h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="flex gap-6 w-full max-w-4xl">
            <div className="flex-1 h-96 bg-slate-200 rounded-2xl animate-pulse delay-75"></div>
            <div className="flex-1 h-96 bg-slate-200 rounded-2xl animate-pulse delay-150"></div>
          </div>
          <div className="w-full max-w-4xl h-48 bg-slate-200 rounded-2xl animate-pulse delay-300"></div>
        </div>
        <div className="text-center space-y-6 relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md mx-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Blank Canvas</h2>
             <p className="text-slate-500 mb-6">Let AI scaffold a beautiful portfolio from your resume data, or start building manually from the inspector.</p>
          </div>
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
          >
            Generate Portfolio
          </button>
        </div>
        <GeneratePortfolioModal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} />
      </div>
    );
  }

  // Theme styles based on accentColor
  const style = {
    '--accent': portfolioData.siteConfig?.accentColor || '#6366f1',
  };

  const themeMode = portfolioData.siteConfig?.themeMode || 'light';
  const themePreset = portfolioData.siteConfig?.themePreset || 'bento';

  return (
    <div className={`h-full w-full relative ${themeMode === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-[#F7F7F8]'} overflow-y-auto overflow-x-hidden custom-scrollbar`} style={style}>
        <div className={`transition-transform duration-300 ${isPreviewMode ? 'scale-50 origin-top-left w-[200%] h-[200%]' : ''}`}>
          {/* Navigation */}
          <PortfolioNav data={portfolioData} blocks={portfolioData.siteConfig?.layout || []} />

          {/* Dynamic Template Engine - perfectly syncs with export and public view! */}
          <div className={themeMode === 'dark' ? 'dark' : ''}>
            {themePreset === 'bento' && <BentoTemplate portfolioData={portfolioData} />}
            {themePreset === 'minimalist' && <MinimalistTemplate portfolioData={portfolioData} />}
            {themePreset === 'creative' && <CreativeTemplate portfolioData={portfolioData} />}
            {(themePreset === 'modern' || themePreset === 'default') && <ModernTemplate portfolioData={portfolioData} />}
          </div>

          {/* Footer */}
          <PortfolioFooter data={portfolioData} />
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 shadow-xl rounded-full p-1 border border-slate-200 dark:border-slate-700 flex">
           <button onClick={() => setIsPreviewMode(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isPreviewMode ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>Edit</button>
           <button onClick={() => setIsPreviewMode(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isPreviewMode ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>Preview</button>
        </div>
    </div>
  );
}
