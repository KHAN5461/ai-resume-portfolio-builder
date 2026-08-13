import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import GlobalApi from './../../service/GlobalApi';

import ModernTemplate from './templates/ModernTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import BentoTemplate from './templates/BentoTemplate';

export default function Portfolio() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const reduxPortfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  const [localData, setLocalData] = useState(reduxPortfolioData);
  const [loading, setLoading] = useState(!reduxPortfolioData);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  useEffect(() => {
    if (!reduxPortfolioData && portfolioId) {
       GlobalApi.GetPortfolioById(portfolioId).then(resp => {
         if(resp.data.data) {
           setLocalData(resp.data.data);
           dispatch({ type: 'portfolio/updatePortfolioData', payload: { id: portfolioId, data: resp.data.data } });
         }
         setLoading(false);
       }).catch(() => {
         setLoading(false);
       });
    } else {
       setLocalData(reduxPortfolioData);
    }
  }, [portfolioId, reduxPortfolioData, dispatch]);

  const portfolioData = localData;

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-background text-on-background">Loading...</div>;
  }

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="text-center bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-md mb-2">No Portfolio Data Found</h2>
          <p className="font-body-md text-on-surface-variant mb-4">Please use the Magic Import to generate your portfolio.</p>
        </div>
      </div>
    );
  }

  // Theme styles based on accentColor
  const style = {
    '--accent': portfolioData.siteConfig?.accentColor || '#6366f1',
  };

  const themePreset = portfolioData.siteConfig?.themePreset || 'bento';

  const updateThemePreset = (preset) => {
    // Optimistic UI update
    setLocalData({
      ...localData,
      siteConfig: {
        ...localData.siteConfig,
        themePreset: preset
      }
    });
    // In a real app, we would also call GlobalApi.UpdatePortfolio to persist this to the DB.
  };

  return (
    <div className="min-h-screen relative" style={style}>
      
      {/* Dynamic Template Engine */}
      {themePreset === 'bento' && <BentoTemplate portfolioData={portfolioData} />}
      {themePreset === 'minimalist' && <MinimalistTemplate portfolioData={portfolioData} />}
      {themePreset === 'creative' && <CreativeTemplate portfolioData={portfolioData} />}
      {(themePreset === 'modern' || themePreset === 'default') && <ModernTemplate portfolioData={portfolioData} />}

      {/* Floating Theme Switcher UI */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-md rounded-full shadow-2xl border border-slate-700/50">
        <span className="material-symbols-outlined text-slate-300 ml-2 text-[20px]">palette</span>
        <div className="h-4 w-px bg-slate-700 mx-1"></div>
        <button 
          onClick={() => updateThemePreset('bento')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${themePreset === 'bento' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          Bento
        </button>
        <button 
          onClick={() => updateThemePreset('modern')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${themePreset === 'modern' || themePreset === 'default' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          Modern
        </button>
        <button 
          onClick={() => updateThemePreset('minimalist')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${themePreset === 'minimalist' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          Minimalist
        </button>
        <button 
          onClick={() => updateThemePreset('creative')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${themePreset === 'creative' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
        >
          Creative
        </button>
      </div>

    </div>
  );
}
