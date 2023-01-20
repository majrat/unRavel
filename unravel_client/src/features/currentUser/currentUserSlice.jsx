import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUserInfo: null,
  },
  reducers: {
    setCurrentUserInfo: (state, user) => {
      state.currentUserInfo = user.payload;
    },
    removeCurrentUserInfo: (state) => {
      state.currentUserInfo = null;
    },
  },
});

export const {
  setCurrentUserInfo,
  removeCurrentUserInfo,
} = currentUserSlice.actions;
export default currentUserSlice.reducer;
