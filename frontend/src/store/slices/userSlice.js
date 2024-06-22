import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserData: (state, { payload }) => {
      state.userInfo = payload;
    },
  },
});

export const { fetchUserData } = userSlice.actions;
export default userSlice.reducer;
