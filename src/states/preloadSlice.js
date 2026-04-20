import { createSlice } from '@reduxjs/toolkit';

const preloadSlice = createSlice({
  name: 'preload',
  initialState: true,
  reducers: {
    setPreload: (_state, action) => action.payload,
  },
});

export const { setPreload } = preloadSlice.actions;
export default preloadSlice.reducer;
