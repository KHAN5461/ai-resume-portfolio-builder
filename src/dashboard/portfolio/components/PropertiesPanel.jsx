import React, { useState, useEffect } from 'react';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { PanelRightClose, PanelRightOpen, Layers, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionManager from './SectionManager';

const PropertiesPanel = ({ activeBlockId, setActiveBlockId, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' or 'properties'

  // Auto-switch to properties when a block is selected
  useEffect(() => {
    if (activeBlockId) {
      setActiveTab('properties');
    }
  }, [activeBlockId]);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-l border-gray-200 dark:border-slate-800 flex flex-col flex-shrink-0 relative z-20"
    >
      {/* Header with Close Button */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 shrink-0 flex items-center justify-between bg-white dark:bg-slate-900">
         <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Inspector</h3>
         <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
           <PanelRightClose className="w-5 h-5" />
         </button>
      </div>

      {/* Pill Tab Switcher */}
      <div className="p-3 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('layers')} 
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'layers' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Layers
          </button>
          <button 
            onClick={() => setActiveTab('properties')} 
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'properties' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Settings2 className="w-3.5 h-3.5" /> Properties
          </button>
        </div>
      </div>

      {/* Breadcrumb (Only show in Properties view if active) */}
      {activeTab === 'properties' && (
         <div className="px-5 py-2 border-b border-gray-100 dark:border-slate-800 shrink-0 bg-gray-50 dark:bg-slate-900/50">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
               Properties / {activeBlockId ? <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">{activeBlockId}</span> : 'None'}
            </p>
         </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'layers' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
           <SectionManager activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-300 overflow-y-auto custom-scrollbar ${activeTab === 'properties' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="p-5">
            {activeBlockId ? (
              <div className="space-y-4">
                {activeBlockId === 'hero' && <HeroForm />}
                {activeBlockId === 'about' && <AboutForm />}
                {activeBlockId === 'projects' && <ProjectsForm />}
                {activeBlockId === 'skills' && <SkillsForm />}
                {activeBlockId === 'contact' && <ContactForm />}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-2">
                   <span className="material-symbols-outlined text-[40px]">architecture</span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nothing Selected</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                   Select a layer or section in the canvas to begin refining its details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default PropertiesPanel;
