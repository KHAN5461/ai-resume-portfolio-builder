import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  syncStatus: 'saved', // 'saved', 'unsaved', 'saving', 'error', 'offline-queued'
  lastSavedAt: null,
  pendingQueueLength: 0,
  lastServerTimestamp: null,
  driveStatus: 'disconnected', // 'disconnected', 'connecting', 'connected'
  driveToken: null, // Strictly in-memory token
  // Subscription state (from Firebase)
  subscription: {
    plan: 'free', // 'free', 'pro', 'enterprise'
    isPremium: false,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  },
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
    setDriveStatus: (state, action) => {
      state.driveStatus = action.payload;
    },
    setDriveToken: (state, action) => {
      state.driveToken = action.payload;
    },
    setSubscription: (state, action) => {
      state.subscription = { ...state.subscription, ...action.payload };
    },
    setLastSavedAt: (state, action) => {
      state.lastSavedAt = action.payload;
    },
    setPendingQueueLength: (state, action) => {
      state.pendingQueueLength = action.payload;
    },
    setLastServerTimestamp: (state, action) => {
      state.lastServerTimestamp = action.payload;
    },
  },
});

export const { setSyncStatus, setDriveStatus, setDriveToken, setSubscription, setLastSavedAt, setPendingQueueLength, setLastServerTimestamp } = syncSlice.actions;

export default syncSlice.reducer;
