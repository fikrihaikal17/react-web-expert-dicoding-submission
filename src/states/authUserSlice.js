import { createSlice } from '@reduxjs/toolkit';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: null,
  reducers: {
    setAuthUser: (_state, action) => action.payload,
    unsetAuthUser: () => null,
  },
});

export const { setAuthUser, unsetAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
