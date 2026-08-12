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
      <div 
        className="w-full min-h-screen relative origin-top-left shadow-lg overflow-x-hidden font-['Inter']" 
        style={{ backgroundColor: '#F4F6F8', color: '#2c3e50' }}
      >
        <div className="flex flex-col min-h-screen">
          <HeroSection data={portfolioData.heroSection} />
          
          <main className="w-full">
            <AboutSection data={portfolioData.aboutSection} />
            <ProjectsSection data={portfolioData.projectsSection} />
            <SkillsSection data={portfolioData.skillsSection} />
            <ContactSection data={portfolioData.contactSection} />
          </main>
          
          <footer className="text-center p-8 mt-8 bg-white text-[#6c757d] border-t border-[#dee2e6]">
            <p>&copy; {new Date().getFullYear()} {portfolioData.personalInfo?.fullName || "Portfolio"}. Created with AI Resume Builder.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
