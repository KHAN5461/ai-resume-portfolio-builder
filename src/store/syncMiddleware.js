import GlobalApi from '../service/GlobalApi';
import { setSyncStatus, setPendingQueueLength } from './syncSlice';

let localSaveTimeout = null;
let apiSaveTimeout = null;
let offlineQueue = [];
let isFlushingQueue = false;

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

export const syncMiddleware = store => {
  if (typeof window !== 'undefined') {
    // Listen for online event to flush queue
    window.addEventListener('online', () => {
      flushQueue(store);
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
              store.dispatch(setSyncStatus('saving'));
              GlobalApi.UpdateResumeDetail(resumeId, { data: resumeData })
                .then(() => {
                  store.dispatch(setSyncStatus('saved'));
                })
                .catch((err) => {
                  console.error("API update error:", err);
                  store.dispatch(setSyncStatus('error'));
                });
            } else {
              // Push to offline queue
              // We could overwrite the previous one if it's the same resumeId
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
