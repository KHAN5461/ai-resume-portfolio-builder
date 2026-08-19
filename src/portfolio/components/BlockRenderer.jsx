import React, { Suspense } from 'react';

const HeroSection = React.lazy(() => import('./HeroSection'));
const AboutSection = React.lazy(() => import('./AboutSection'));
const ProjectsSection = React.lazy(() => import('./ProjectsSection'));
const SkillsSection = React.lazy(() => import('./SkillsSection'));
const ContactSection = React.lazy(() => import('./ContactSection'));

const BlockRenderer = ({ blockName, data }) => {
  if (!data) return null;
  
  const blocks = {
    HeroSection,
    AboutSection,
    ProjectsSection,
    SkillsSection,
    ContactSection
  };
  
  const Component = blocks[blockName];
  if (!Component) return null;
  
  return (
    <Suspense fallback={<div className="w-full min-h-[100px] flex items-center justify-center text-sm text-slate-500">Loading block...</div>}>
      <Component data={data} />
    </Suspense>
  );
};

export default BlockRenderer;
