import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import PortfolioNav from './components/PortfolioNav';
import PortfolioFooter from './components/PortfolioFooter';
import GlobalApi from './../../service/GlobalApi';

import { getAllPortfolioTemplates, getPortfolioTemplateById } from './templates/registry';

export default function Portfolio({ isPublic = false }) {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const reduxPortfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  const [localData, setLocalData] = useState(reduxPortfolioData);
  const [loading, setLoading] = useState(!reduxPortfolioData);
  const allTemplates = getAllPortfolioTemplates();

  useEffect(() => {
    let isMounted = true;
    if (!reduxPortfolioData && portfolioId) {
       GlobalApi.GetPortfolioById(portfolioId).then(resp => {
         if(resp.data.data && isMounted) {
           setLocalData(resp.data.data);
           dispatch({ type: 'portfolio/updatePortfolioData', payload: { id: portfolioId, data: resp.data.data } });
         }
         if (isMounted) setLoading(false);
       }).catch(() => {
         if (isMounted) setLoading(false);
       });
    } else {
       if (isMounted) setLocalData(reduxPortfolioData);
    }
    
    // Increment view count if public route
    if (isPublic && portfolioId) {
        GlobalApi.IncrementPortfolioViews(portfolioId).catch(console.error);
    }

    return () => { isMounted = false; };
  }, [portfolioId, reduxPortfolioData, dispatch, isPublic]);

  const portfolioData = localData;

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-background text-on-background">Loading...</div>;
  }

  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="text-center bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-md mb-2">No Portfolio Data Found</h2>
          <p className="font-body-md text-on-surface-variant mb-4">This portfolio might be private or deleted.</p>
        </div>
      </div>
    );
  }

  // Theme styles based on accentColor
  const style = {
    '--accent': portfolioData.siteConfig?.accentColor || '#6366f1',
  };

  const themePreset = portfolioData.siteConfig?.themePreset || 'bento';
  const themeMode = portfolioData.siteConfig?.themeMode || 'light';
  const activeTemplate = getPortfolioTemplateById(themePreset);
  const ActiveTemplateComponent = activeTemplate?.component;

  const updateThemePreset = (preset) => {
    const updated = {
      ...localData,
      siteConfig: {
        ...(localData.siteConfig || {}),
        themePreset: preset
      }
    };
    setLocalData(updated);
    if (portfolioId) {
      GlobalApi.UpdatePortfolioDetail(portfolioId, { data: updated }).catch((err) => {
        console.warn('Could not persist theme update:', err);
      });
    }
  };

  return (
    <div className={`min-h-screen relative ${themeMode === 'dark' ? 'dark bg-slate-950 text-white' : ''}`} style={style}>
      
      {/* Navigation */}
      <PortfolioNav data={portfolioData} blocks={portfolioData.siteConfig?.layout || []} />

      {/* Dynamic Template Engine */}
      <div className={themeMode === 'dark' ? 'dark' : ''}>
        {ActiveTemplateComponent && <ActiveTemplateComponent portfolioData={portfolioData} />}
      </div>

      {/* Footer */}
      <PortfolioFooter data={portfolioData} />

      {/* Floating Theme Switcher UI */}
      {!isPublic && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-slate-900/95 backdrop-blur-md rounded-full shadow-2xl border border-slate-700 max-w-[90vw] overflow-x-auto">
          <span className="material-symbols-outlined text-slate-300 ml-2.5 text-[18px] shrink-0">palette</span>
          <div className="h-4 w-px bg-slate-700 mx-1 shrink-0"></div>
          {allTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => updateThemePreset(tmpl.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                themePreset === tmpl.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tmpl.name}</span>
              {tmpl.isCustom && (
                <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Custom
                </span>
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
