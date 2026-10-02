import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import SharedThemeBuilder from '@/components/custom/SharedThemeBuilder';

export default function MobileFormatDrawer({
  isOpen,
  onClose,
  documentId
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-h-[85vh] h-[78vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800 z-10 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
          >
            {/* Draggable Handle Bar */}
            <div 
              onClick={onClose}
              className="pt-3 pb-2 flex justify-center shrink-0 cursor-pointer active:opacity-70"
            >
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Format & Styling</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Templates, accent colors, and typography</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close Formatting Drawer"
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Theme Builder Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <SharedThemeBuilder type="resume" documentId={documentId} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
