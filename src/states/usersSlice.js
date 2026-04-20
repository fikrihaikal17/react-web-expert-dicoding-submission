import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (_state, action) => action.payload,
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
