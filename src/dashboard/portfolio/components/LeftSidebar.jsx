import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutList, Bot, PanelLeftClose } from 'lucide-react';
import SectionManager from './SectionManager';
import AiCoPilot from './AiCoPilot';

export default function LeftSidebar({ activeBlockId, setActiveBlockId, isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' or 'ai'

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-r border-gray-200 dark:border-slate-800 flex flex-col flex-shrink-0 relative z-20 overflow-hidden"
    >
      <div className="w-[320px] flex flex-col h-full">
        {/* Tabs Header */}
        <div className="px-3 pt-3 flex justify-between items-center border-b border-gray-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1 w-full">
            <button 
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-2 px-3 py-2 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === 'sections' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutList className="w-4 h-4" />
              Sections
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3 py-2 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === 'ai' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 mb-1"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
           <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'sections' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <SectionManager activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} />
           </div>
           
           <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'ai' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <AiCoPilot activeBlockId={activeBlockId} />
           </div>
        </div>
      </div>
    </motion.aside>
  );
}
