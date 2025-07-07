// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null,      // 'admin', 'user', 'guest', etc.
  token: null,         // Auth token (JWT or similar)
  userInfo: null,      // Any user profile data
  error: null,         // Auth or global error
  progress: 0,         // For loading progress bar
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Auth
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuth: (state, action) => {
      Object.assign(state, action.payload);
    },

    // ✅ User Info
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    // ✅ Progress
    setProgress: (state, action) => {
      state.progress = Math.max(0, Math.min(100, action.payload));
    },

    // ✅ Logout / Reset
    resetUserState: () => initialState,
  },
});

export const {
  setUserType,
  setToken,
  setAuthError,
  clearAuthError,
  setAuth,
  setUserInfo,
  setProgress,
  resetUserState,
} = userSlice.actions;

// ✅ Selectors (Optional)
export const selectUserType = (state) => state.user.userType;
export const selectToken = (state) => state.user.token;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectProgress = (state) => state.user.progress;
export const selectAuthError = (state) => state.user.error;

export default userSlice.reducer;
