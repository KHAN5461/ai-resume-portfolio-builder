import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Sparkles, 
  User, 
  Plus, 
  X, 
  Globe, 
  UploadCloud, 
  Mail, 
  Mic, 
  LayoutTemplate,
  ChevronRight
} from 'lucide-react';
import AddResume from '@/dashboard/components/AddResume';
import AddPortfolio from '@/dashboard/components/AddPortfolio';
import MagicImportModal from '@/dashboard/components/MagicImportModal';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Hide on editor or standalone view pages where custom mobile toolbars exist
  if (path.includes('/edit') || path.includes('/view') || path.startsWith('/auth')) {
    return null;
  }

  const isCurrentActive = (target) => {
    if (target === '/') return path === '/';
    return path.startsWith(target);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Documents', path: '/dashboard', icon: FileText },
    // Center button slot
    { label: 'Coach', path: '/interview', icon: Mic },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Bottom Navigation Dock */}
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-4 pt-1.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {/* Left Nav Items */}
          <div className="flex items-center space-x-2 flex-1 justify-around">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all active:scale-95 ${
                    active
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  aria-label={item.label}
                >
                  <div className={`p-1 rounded-lg ${active ? 'bg-sky-50 dark:bg-sky-950/50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Center Elevated Action Button */}
          <div className="relative -top-5 px-2">
            <button
              onClick={() => setIsQuickActionOpen(true)}
              aria-label="Open Quick Action Menu"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] active:scale-90 hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.6)] transition-all ring-4 ring-white dark:ring-slate-900"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* Right Nav Items */}
          <div className="flex items-center space-x-2 flex-1 justify-around">
            {navItems.slice(2).map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all active:scale-95 ${
                    active
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  aria-label={item.label}
                >
                  <div className={`p-1 rounded-lg ${active ? 'bg-sky-50 dark:bg-sky-950/50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Quick Action Bottom Sheet Drawer */}
      <AnimatePresence>
        {isQuickActionOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsQuickActionOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 z-10 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div 
                onClick={() => setIsQuickActionOpen(false)}
                className="pt-1 pb-3 flex justify-center cursor-pointer active:opacity-70"
              >
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Quick Actions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">What would you like to create or practice?</p>
                </div>
                <button
                  onClick={() => setIsQuickActionOpen(false)}
                  className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Close Quick Actions"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions Grid / List */}
              <div className="mt-4 space-y-2.5">
                {/* 1. New AI Resume */}
                <AddResume
                  renderTrigger={(openModal) => (
                    <button
                      onClick={() => {
                        setIsQuickActionOpen(false);
                        openModal();
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">Create New Resume</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Tailored with AI bullet polish & ATS checker</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                />

                {/* 2. New Portfolio Website */}
                <AddPortfolio
                  renderTrigger={(openModal) => (
                    <button
                      onClick={() => {
                        setIsQuickActionOpen(false);
                        openModal();
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">Build Portfolio Website</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Interactive showcases, bento grids & custom themes</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                />

                {/* 3. Magic Import */}
                <MagicImportModal
                  renderTrigger={(openModal) => (
                    <button
                      onClick={() => {
                        setIsQuickActionOpen(false);
                        openModal();
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">Magic Import (PDF / LinkedIn)</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Extract skills, experience & roles in seconds</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                />

                {/* 4. AI Cover Letter */}
                <button
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    navigate('/dashboard/cover-letters');
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">AI Cover Letter Generator</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Target specific job descriptions & hiring managers</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. Mock Interview Practice */}
                <button
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    navigate('/interview');
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">AI Interview Prep Coach</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Voice practice and instant real-time feedback</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 6. Template Gallery */}
                <button
                  onClick={() => {
                    setIsQuickActionOpen(false);
                    navigate('/templates');
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all active:scale-[0.98] min-h-[56px] text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Explore Template Gallery</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Modern, classic, tech, and creative resume styles</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
