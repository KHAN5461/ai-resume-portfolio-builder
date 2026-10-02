import { setSyncStatus } from './syncSlice';
import syncManager from '../service/SyncManager';
import StorageService from '../service/StorageService';

let localSaveTimeout = null;
let syncDispatchTimeout = null;

export const syncMiddleware = store => {
  return next => action => {
    const result = next(action);

    // Track active resume edits and profile edits
    if (
      action.type === 'resume/setResumeData' || 
      action.type === 'profile/updateProfileData' ||
      action.type === 'profile/updatePersonalInfo' ||
      action.type === 'profile/setProfileData'
    ) {
      store.dispatch(setSyncStatus('unsaved'));

      // 1. Debounced localStorage update for current editor state
      if (localSaveTimeout) clearTimeout(localSaveTimeout);
      localSaveTimeout = setTimeout(() => {
        const state = store.getState();
        try {
          const stateToSave = {
            resume: state.resume,
            portfolio: state.portfolio,
            profile: state.profile
          };
          localStorage.setItem('sparkfolio_state', JSON.stringify(stateToSave));
        } catch (e) {
          console.error("Could not save editor state to localStorage", e);
        }
      }, 300);

      // 2. Identify current resume and route through SyncManager (Local First + Silent Firestore Background)
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/dashboard\/resume\/([^/]+)\/edit/);
        const resumeId = match ? match[1] : null;

        if (resumeId) {
          if (syncDispatchTimeout) clearTimeout(syncDispatchTimeout);
          syncDispatchTimeout = setTimeout(() => {
            const state = store.getState();
            const resumeData = {
              ...(state.resume?.present?.resumeData || {}),
              ...(state.profile?.present || {})
            };
            if (resumeData && Object.keys(resumeData).length > 0) {
              // Commit to local vault immediately
              StorageService.saveResumeLocalOnly({
                ...resumeData,
                documentId: resumeId,
                resumeId
              });

              // Silent cloud queue background sync
              syncManager.enqueue('UPSERT_RESUME', {
                ...resumeData,
                documentId: resumeId,
                resumeId
              });
            }
          }, 1200);
        }
      }
    }

    // Track portfolio edits
    if (action.type === 'portfolio/setPortfolioData') {
      store.dispatch(setSyncStatus('unsaved'));

      if (localSaveTimeout) clearTimeout(localSaveTimeout);
      localSaveTimeout = setTimeout(() => {
        const state = store.getState();
        const portfolioData = state.portfolio?.portfolioData;
        if (portfolioData) {
          const portfolioId = portfolioData.documentId || portfolioData.portfolioId;
          if (portfolioId) {
            StorageService.savePortfolioLocalOnly(portfolioData);
            syncManager.enqueue('UPSERT_PORTFOLIO', portfolioData);
          }
        }
      }, 1000);
    }

    return result;
  };
};
