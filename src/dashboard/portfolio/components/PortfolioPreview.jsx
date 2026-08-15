import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
const HeroSection = React.lazy(() => import('../../../portfolio/components/HeroSection'));
const AboutSection = React.lazy(() => import('../../../portfolio/components/AboutSection'));
const ProjectsSection = React.lazy(() => import('../../../portfolio/components/ProjectsSection'));
const SkillsSection = React.lazy(() => import('../../../portfolio/components/SkillsSection'));
const ContactSection = React.lazy(() => import('../../../portfolio/components/ContactSection'));

export default function PortfolioPreview() {
  const { portfolioId } = useParams();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);

  if (!portfolioData) return null;

  const layout = portfolioData.siteConfig?.layout || [
    { id: 'hero', visible: true },
    { id: 'about', visible: true },
    { id: 'projects', visible: true },
    { id: 'skills', visible: true },
    { id: 'contact', visible: true }
  ];

  const sectionComponents = {
    hero: <HeroSection data={portfolioData.heroSection} />,
    about: <AboutSection data={portfolioData.aboutSection} />,
    projects: <ProjectsSection data={portfolioData.projectsSection} />,
    skills: <SkillsSection data={portfolioData.skillsSection} />,
    contact: <ContactSection data={portfolioData.contactSection} />
  };

  return (
    <div className='border-l pl-10 sticky top-10 h-screen overflow-y-auto overflow-x-hidden max-w-full'>
      <div 
        className="w-full min-h-screen relative origin-top-left shadow-lg overflow-x-hidden font-['Inter']" 
        style={{ backgroundColor: '#F4F6F8', color: '#2c3e50' }}
      >
        <div className="flex flex-col min-h-screen">
          {layout.map((item) => (
            item.visible && (
              <React.Fragment key={item.id}>
                <React.Suspense fallback={<div className="p-12 text-center text-slate-400">Loading section...</div>}>
                  {sectionComponents[item.id]}
                </React.Suspense>
              </React.Fragment>
            )
          ))}
          
          <footer className="text-center p-8 mt-auto bg-white text-[#6c757d] border-t border-[#dee2e6]">
            <p>&copy; {new Date().getFullYear()} {portfolioData.personalInfo?.fullName || "Portfolio"}. Created with AI Resume Builder.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
