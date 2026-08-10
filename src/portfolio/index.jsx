import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import GlobalApi from './../../service/GlobalApi';

export default function Portfolio() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const reduxPortfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  const [localData, setLocalData] = useState(reduxPortfolioData);
  const [loading, setLoading] = useState(!reduxPortfolioData);

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

  // If there's no data, we should probably redirect back or show a message.
  // Assuming the user needs to generate it first.
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

  return (
    <div 
      className="min-h-screen bg-background text-on-background font-body-md selection:bg-primary-container/30"
      style={style}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-32">
        <HeroSection data={portfolioData.heroSection} />
        <AboutSection data={portfolioData.aboutSection} />
        <ProjectsSection data={portfolioData.projectsSection} />
        <SkillsSection data={portfolioData.skillsSection} />
        <ContactSection data={portfolioData.contactSection} />
      </div>
    </div>
  );
}
