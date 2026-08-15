import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTasks: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      const taskId = action.payload;
      state.activeTasks[taskId] = true;
    },
    stopLoading: (state, action) => {
      const taskId = action.payload;
      delete state.activeTasks[taskId];
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export const selectIsAnyLoading = (state) => Object.keys(state.loading.activeTasks).length > 0;
export const selectIsLoading = (taskId) => (state) => !!state.loading.activeTasks[taskId];

export default loadingSlice.reducer;
