import React from 'react';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertiesPanel = ({ activeBlockId, isOpen, onToggle }) => {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-l border-gray-200 dark:border-slate-800 overflow-y-auto custom-scrollbar flex-shrink-0 relative z-20"
    >
      <div className="p-6 w-[320px]">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-slate-800 pb-2">
          <h2 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">
            {activeBlockId ? `Edit ${activeBlockId}` : 'Properties'}
          </h2>
          <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
            <PanelRightClose className="w-5 h-5" />
          </button>
        </div>
        
        {activeBlockId ? (
          <div className="space-y-4">
            {activeBlockId === 'hero' && <HeroForm />}
            {activeBlockId === 'about' && <AboutForm />}
            {activeBlockId === 'projects' && <ProjectsForm />}
            {activeBlockId === 'skills' && <SkillsForm />}
            {activeBlockId === 'contact' && <ContactForm />}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>Select a block to edit its properties.</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default PropertiesPanel;
