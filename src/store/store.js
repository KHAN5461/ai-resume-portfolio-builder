import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import resumeReducer from './resumeSlice';
import portfolioReducer from './portfolioSlice';
import profileReducer from './profileSlice';
import syncReducer from './syncSlice';
import loadingReducer from './loadingSlice';
import { syncMiddleware } from './syncMiddleware';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

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
    resume: undoable(resumeReducer, { limit: 50 }),
    portfolio: undoable(portfolioReducer, { limit: 50 }),
    profile: undoable(profileReducer, { limit: 50 }),
    sync: syncReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syncMiddleware),
  preloadedState,
});
