import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: 'all',
  reducers: {
    setActiveCategory: (_state, action) => action.payload,
  },
});

export const { setActiveCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
