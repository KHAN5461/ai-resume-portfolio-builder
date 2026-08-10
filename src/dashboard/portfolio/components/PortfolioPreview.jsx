import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import HeroSection from '../../../portfolio/components/HeroSection';
import AboutSection from '../../../portfolio/components/AboutSection';
import ProjectsSection from '../../../portfolio/components/ProjectsSection';
import SkillsSection from '../../../portfolio/components/SkillsSection';
import ContactSection from '../../../portfolio/components/ContactSection';

export default function PortfolioPreview() {
  const { portfolioId } = useParams();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);

  if (!portfolioData) return null;

  return (
    <div className='border-l pl-10 sticky top-10 h-screen overflow-y-auto'>
      <div className="bg-zinc-950 text-zinc-50 rounded-xl overflow-hidden shadow-2xl scale-[0.6] origin-top-left w-[166%] h-[166%] relative pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-32">
          <HeroSection data={portfolioData.heroSection} />
          <AboutSection data={portfolioData.aboutSection} />
          <ProjectsSection data={portfolioData.projectsSection} />
          <SkillsSection data={portfolioData.skillsSection} />
          <ContactSection data={portfolioData.contactSection} />
        </div>
      </div>
    </div>
  );
}
