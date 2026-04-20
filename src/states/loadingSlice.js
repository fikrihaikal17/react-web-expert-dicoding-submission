import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: 0,
  reducers: {
    showLoading: (state) => state + 1,
    hideLoading: (state) => Math.max(state - 1, 0),
  },
});

export const { hideLoading, showLoading } = loadingSlice.actions;
export const selectIsLoading = (state) => state.loading > 0;
export default loadingSlice.reducer;
