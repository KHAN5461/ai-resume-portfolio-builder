import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';
import portfolioReducer from './portfolioSlice';
import { supabase } from '../lib/supabaseClient';

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

// Safe save to LocalStorage and Supabase
const saveState = async (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('sparkfolio_state', serializedState);

    // Try to save to Supabase if authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('user_data').upsert({
        id: session.user.id,
        state_data: state,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
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
  }, 1000); // 1s debounce to avoid spamming Supabase
});
