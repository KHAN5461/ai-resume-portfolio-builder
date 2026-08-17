import React, { useEffect } from 'react';
import SectionInspectorNav from './SectionInspectorNav';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { PanelRightClose } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnifiedInspector({ activeBlockId, setActiveBlockId, isOpen, onToggle }) {
  
  // Default to hero if nothing is selected
  const activeSection = activeBlockId || 'hero';

  // Live Sync Scroll Effect
  useEffect(() => {
    if (activeSection) {
      // Small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(activeSection);
        if (element) {
          // Scroll smoothly with a little padding for sticky headers if they existed
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const renderForm = () => {
    switch (activeSection) {
      case 'hero': return <HeroForm />;
      case 'about': return <AboutForm />;
      case 'projects': return <ProjectsForm />;
      case 'skills': return <SkillsForm />;
      case 'contact': return <ContactForm />;
      default: return <HeroForm />;
    }
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-xl flex-shrink-0 relative z-20 overflow-hidden"
    >
      
      {/* Inspector Title Bar */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Properties
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {activeSection}
          </span>
        </h2>
        <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
           <PanelRightClose className="w-5 h-5" />
        </button>
      </div>

      {/* Section Stepper / Indicator Nav */}
      <div className="p-4 pb-0 shrink-0">
        <SectionInspectorNav currentSection={activeSection} onSelectSection={setActiveBlockId} />
      </div>

      {/* Scrollable Properties Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-4">
          {renderForm()}
        </div>
      </div>

    </motion.aside>
  );
}
