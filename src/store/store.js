import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import portfolioReducer from './portfolioSlice';
import syncReducer from './syncSlice';
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
    resume: resumeReducer,
    portfolio: portfolioReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syncMiddleware),
  preloadedState,
});
