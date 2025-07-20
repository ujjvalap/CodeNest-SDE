// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = Object.freeze({
  userType: null,      // 'admin', 'user', 'guest', etc.
  token: null,         // Auth token (JWT or similar)
  userInfo: null,      // Any user profile data
  error: null,         // Auth or global error
  progress: 0,         // For loading progress bar
});

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
      // Only update known keys for safety and performance
      const { userType, token, userInfo, error, progress } = action.payload;
      if (userType !== undefined) state.userType = userType;
      if (token !== undefined) state.token = token;
      if (userInfo !== undefined) state.userInfo = userInfo;
      if (error !== undefined) state.error = error;
      if (progress !== undefined) state.progress = progress;
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


// ✅ Memoized Selectors for performance
import { createSelector } from "reselect";

export const selectUserType = createSelector(
  (state) => state.user.userType,
  (userType) => userType
);
export const selectToken = createSelector(
  (state) => state.user.token,
  (token) => token
);
export const selectUserInfo = createSelector(
  (state) => state.user.userInfo,
  (userInfo) => userInfo
);
export const selectProgress = createSelector(
  (state) => state.user.progress,
  (progress) => progress
);
export const selectAuthError = createSelector(
  (state) => state.user.error,
  (error) => error
);

export default userSlice.reducer;
