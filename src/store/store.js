import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import resumeReducer from './resumeSlice';
import portfolioReducer from './portfolioSlice';
import profileReducer from './profileSlice';
import syncReducer from './syncSlice';
import loadingReducer from './loadingSlice';
import { syncMiddleware } from './syncMiddleware';

// Safe load from LocalStorage (Fallback)
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('sparkfolio_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    resume: undoable(resumeReducer, { 
      limit: 25,
      filter: (action, currentState, previousHistory) => {
        // Avoid duplicate snapshots of identical states
        return previousHistory.present !== currentState;
      }
    }),
    portfolio: undoable(portfolioReducer, { limit: 25 }),
    profile: undoable(profileReducer, { limit: 25 }),
    sync: syncReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syncMiddleware),
  preloadedState,
});
