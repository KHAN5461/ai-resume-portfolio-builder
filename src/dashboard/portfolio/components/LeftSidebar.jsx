import React from 'react';
import { motion } from 'framer-motion';
import { Bot, PanelLeftClose } from 'lucide-react';
import AiCoPilot from './AiCoPilot';

export default function LeftSidebar({ activeBlockId, isOpen, onToggle }) {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-r border-gray-200 dark:border-slate-800 flex flex-col flex-shrink-0 relative z-20 overflow-hidden"
    >
      <div className="w-[320px] flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
             <Bot className="w-5 h-5" />
             AI Editor
          </div>
          <button 
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
           <AiCoPilot activeBlockId={activeBlockId} />
        </div>
      </div>
    </motion.aside>
  );
}
