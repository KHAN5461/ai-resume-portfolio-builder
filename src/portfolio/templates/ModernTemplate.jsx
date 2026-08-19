import React from 'react';
import BlockRenderer from '../components/BlockRenderer';

export default function ModernTemplate({ portfolioData }) {
  if (!portfolioData) return null;

  return (
    <div className="w-full">
      <BlockRenderer blockName="HeroSection" data={portfolioData.heroSection} />
      <BlockRenderer blockName="AboutSection" data={portfolioData.aboutSection} />
      <BlockRenderer blockName="ProjectsSection" data={portfolioData.projectsSection} />
      <BlockRenderer blockName="SkillsSection" data={portfolioData.skillsSection} />
      <BlockRenderer blockName="ContactSection" data={portfolioData.contactSection} />
    </div>
  );
}
