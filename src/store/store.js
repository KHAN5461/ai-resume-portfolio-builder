import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import portfolioReducer from './portfolioSlice';
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

// Safe save to LocalStorage and Firebase
const saveState = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('sparkfolio_state', serializedState);

    // Try to save to Firebase if authenticated
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'user_data', user.uid), {
        state_data: state,
        updated_at: new Date().toISOString()
      }, { merge: true });
    }
  } catch {
    // ignore write errors
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    portfolio: portfolioReducer,
  },
  preloadedState,
});

let timeoutId = null;
store.subscribe(() => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    saveState({
      resume: store.getState().resume,
      portfolio: store.getState().portfolio
    });
  }, 1000); // 1s debounce to avoid spamming Firebase
});
