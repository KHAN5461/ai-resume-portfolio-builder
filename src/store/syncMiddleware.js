import GlobalApi from '../service/GlobalApi';
import { setSyncStatus, setPendingQueueLength } from './syncSlice';

let localSaveTimeout = null;
let apiSaveTimeout = null;
let offlineQueue = [];
let onlineQueue = []; // Queue for tracking pending online saves
let isFlushingQueue = false;
let isOnlineSaving = false; // Lock for online saves

const flushQueue = async (store) => {
  if (isFlushingQueue || offlineQueue.length === 0 || !navigator.onLine) return;

  isFlushingQueue = true;
  store.dispatch(setSyncStatus('saving'));

  while (offlineQueue.length > 0 && navigator.onLine) {
    const { resumeId, resumeData } = offlineQueue[0];
    try {
      await GlobalApi.UpdateResumeDetail(resumeId, { data: resumeData });
      offlineQueue.shift(); // Remove successful item
      store.dispatch(setPendingQueueLength(offlineQueue.length));
    } catch (error) {
      console.error("Failed to sync queued item:", error);
      store.dispatch(setSyncStatus('error'));
      isFlushingQueue = false;
      return; // Stop processing on error
    }
  }

  isFlushingQueue = false;
  if (offlineQueue.length === 0) {
    store.dispatch(setSyncStatus('saved'));
  }
};

const processOnlineQueue = async (store) => {
  if (isOnlineSaving || onlineQueue.length === 0 || !navigator.onLine) return;
  
  isOnlineSaving = true;
  store.dispatch(setSyncStatus('saving'));
  
  while (onlineQueue.length > 0) {
    const { resumeId, resumeData, previousState } = onlineQueue[0];
    try {
      await GlobalApi.UpdateResumeDetail(resumeId, { data: resumeData });
      onlineQueue.shift(); // Remove successful item
    } catch (error) {
      console.error("API update error:", error);
      store.dispatch(setSyncStatus('error'));
      // Optimistic Rollback logic (for demonstration, we restore localStorage and notify)
      try {
        localStorage.setItem('sparkfolio_state', previousState);
      } catch (e) {
        console.error("Failed to rollback local state", e);
      }
      onlineQueue.shift(); // Drop the failed save to prevent infinite loops, or we could leave it
      isOnlineSaving = false;
      return;
    }
  }
  
  isOnlineSaving = false;
  store.dispatch(setSyncStatus('saved'));
};

export const syncMiddleware = store => {
  if (typeof window !== 'undefined') {
    // Listen for online event to flush queue
    window.addEventListener('online', () => {
      flushQueue(store);
      processOnlineQueue(store);
    });
  }

  return next => action => {
    const result = next(action);

    if (action.type === 'resume/setResumeData' || action.type === 'portfolio/setPortfolioData') {
      store.dispatch(setSyncStatus('unsaved'));

      // Local storage debounce
      if (localSaveTimeout) clearTimeout(localSaveTimeout);
      localSaveTimeout = setTimeout(() => {
        const state = store.getState();
        try {
          const stateToSave = {
            resume: state.resume,
            portfolio: state.portfolio
          };
          localStorage.setItem('sparkfolio_state', JSON.stringify(stateToSave));
        } catch (e) {
          console.error("Could not save state to localStorage", e);
        }
      }, 500);

      if (typeof window !== 'undefined') {
        // Extract resumeId from pathname
        const pathname = window.location.pathname;
        const match = pathname.match(/\/dashboard\/resume\/([^/]+)\/edit/);
        const resumeId = match ? match[1] : null;
  
        if (resumeId) {
          // API Save debounce
          if (apiSaveTimeout) clearTimeout(apiSaveTimeout);
          apiSaveTimeout = setTimeout(() => {
            const state = store.getState();
            const resumeData = state.resume.present.resumeData;
            
            if (navigator.onLine) {
              const previousState = localStorage.getItem('sparkfolio_state');
              
              // Push to online queue
              const existingIndex = onlineQueue.findIndex(item => item.resumeId === resumeId);
              if (existingIndex !== -1) {
                onlineQueue[existingIndex] = { resumeId, resumeData, previousState };
              } else {
                onlineQueue.push({ resumeId, resumeData, previousState });
              }
              
              processOnlineQueue(store);
            } else {
              // Push to offline queue
              const existingIndex = offlineQueue.findIndex(item => item.resumeId === resumeId);
              if (existingIndex !== -1) {
                offlineQueue[existingIndex].resumeData = resumeData;
              } else {
                offlineQueue.push({ resumeId, resumeData });
              }
              store.dispatch(setSyncStatus('offline-queued'));
              store.dispatch(setPendingQueueLength(offlineQueue.length));
            }
          }, 2500);
        }
      }
    }

    return result;
  };
};
