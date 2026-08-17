import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';

export default function ModernTemplate({ portfolioData }) {
  if (!portfolioData) return null;

  return (
    <div className="w-full">
      <HeroSection data={portfolioData.heroSection} />
      <AboutSection data={portfolioData.aboutSection} />
      <ProjectsSection data={portfolioData.projectsSection} />
      <SkillsSection data={portfolioData.skillsSection} />
      <ContactSection data={portfolioData.contactSection} />
    </div>
  );
}
