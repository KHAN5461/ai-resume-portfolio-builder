import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Eye, Download, CheckCircle2, Clock, CloudOff } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Custom hook to detect horizontal swipe gestures while protecting against vertical scrolling interference.
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Triggered when user swipes left (e.g., to next tab)
 * @param {Function} options.onSwipeRight - Triggered when user swipes right (e.g., to previous tab)
 * @param {number} [options.threshold=60] - Minimum horizontal swipe distance in pixels
 * @param {number} [options.maxVerticalDelta=50] - Maximum vertical displacement allowed to count as horizontal swipe
 */
export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 60, maxVerticalDelta = 50 }) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const onTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const onTouchEnd = (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - touchStartRef.current.x;
    const deltaY = touchEnd.clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;

    // Must be a relatively deliberate swipe gesture under 800ms
    if (duration > 800) return;

    // Ensure movement was primarily horizontal, not vertical scrolling
    if (Math.abs(deltaY) > maxVerticalDelta) return;

    if (deltaX < -threshold) {
      // Swiped left
      onSwipeLeft?.();
    } else if (deltaX > threshold) {
      // Swiped right
      onSwipeRight?.();
    }
  };

  return { onTouchStart, onTouchEnd };
}

/**
 * MobileEditorNavigator: Sticky sub-header tab switcher for toggling between
 * 'Form Editor' and 'Live Preview' views on mobile screens.
 */
export default function MobileEditorNavigator({
  view = 'builder',
  onViewChange,
  syncStatus = 'saved',
  onDownload,
  className = '',
}) {
  const isFormActive = view === 'builder';
  const isPreviewActive = view === 'preview';

  const handleSyncClick = () => {
    if (syncStatus === 'saving' || syncStatus === 'unsaved') {
      toast.info('Syncing changes in real-time...');
    } else if (syncStatus === 'offline-queued') {
      toast.warning('Offline: Changes are saved locally and will sync when reconnected.');
    } else {
      toast.success('All changes are up to date and synced.');
    }
  };

  return (
    <div
      className={`md:hidden sticky top-16 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2 px-3 flex items-center justify-between gap-2 z-30 border-b border-slate-200/80 dark:border-slate-800 shrink-0 shadow-xs ${className}`}
      role="navigation"
      aria-label="Mobile Editor View Switcher"
    >
      {/* Pill-Style Segmented Switcher */}
      <div className="relative flex bg-slate-100 dark:bg-slate-800/90 rounded-2xl p-1 border border-slate-200/80 dark:border-slate-700/60 flex-1 max-w-[280px]">
        {/* Form Editor Tab */}
        <button
          onClick={() => onViewChange?.('builder')}
          className={`relative flex-1 py-2 px-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 min-h-[42px] transition-colors z-10 select-none ${
            isFormActive
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Switch to Form Editor"
          aria-selected={isFormActive}
          role="tab"
        >
          {isFormActive && (
            <motion.div
              layoutId="mobileActiveTabIndicator"
              className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-700/60 -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <FileEdit className="w-4 h-4 shrink-0" />
          <span className="truncate">Form Editor</span>
        </button>

        {/* Live Preview Tab */}
        <button
          onClick={() => onViewChange?.('preview')}
          className={`relative flex-1 py-2 px-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 min-h-[42px] transition-colors z-10 select-none ${
            isPreviewActive
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Switch to Live Canvas Preview"
          aria-selected={isPreviewActive}
          role="tab"
        >
          {isPreviewActive && (
            <motion.div
              layoutId="mobileActiveTabIndicator"
              className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-700/60 -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Eye className="w-4 h-4 shrink-0" />
          <span className="truncate">Live Preview</span>
        </button>
      </div>

      {/* Right Actions: Live Sync Badge & Quick Download Action */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Real-Time Sync Status Badge */}
        <button
          onClick={handleSyncClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/50 text-[11px] font-medium shrink-0 min-h-[42px] active:scale-95 transition-all cursor-pointer"
          title="Autosave & Sync Status (tap for details)"
          aria-label="Synchronization Status"
        >
          {syncStatus === 'saving' || syncStatus === 'unsaved' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-500 sm:hidden" />
              <span className="text-amber-600 dark:text-amber-400 font-semibold hidden sm:inline">Syncing</span>
            </>
          ) : syncStatus === 'offline-queued' ? (
            <>
              <CloudOff className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-semibold hidden sm:inline">Local</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 sm:hidden" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">Synced</span>
            </>
          )}
        </button>

        {/* Quick Download Action Button */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm border border-indigo-500/30 text-xs font-semibold shrink-0 min-h-[42px] active:scale-95 transition-all cursor-pointer"
            title="Quick Download / Export"
            aria-label="Quick Download Resume"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">PDF</span>
          </button>
        )}
      </div>
    </div>
  );
}
