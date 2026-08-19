import React from 'react';
import { motion } from 'framer-motion';
import { Bot, PanelLeftClose } from 'lucide-react';
import AiCoPilot from './AiCoPilot';

export default function LeftSidebar({ activeBlockId, isOpen, onToggle }) {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 340 : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-surface/80 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col flex-shrink-0 relative z-20 overflow-hidden shadow-soft"
    >
      <div className="w-[340px] flex flex-col h-full">
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-outline-variant/20 shrink-0 bg-gradient-to-b from-surface/50 to-transparent">
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-tight">
             <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
               <Bot className="w-4 h-4 text-primary" />
             </div>
             AI Assistant
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="text-text-muted hover:text-text transition-colors p-1.5 rounded-lg hover:bg-surface-muted border border-transparent hover:border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            aria-label="Close AI Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
           <AiCoPilot activeBlockId={activeBlockId} />
        </div>
      </div>
    </motion.aside>
  );
}
