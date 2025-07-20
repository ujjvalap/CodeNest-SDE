
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import uiReducer from "./slices/uiSlice";
import { questionsApi } from './api/api'; // RTK Query API

export const store = configureStore({
  reducer: {
    user: authReducer,    // single source of truth for user/auth state
    ui: uiReducer, 
    [questionsApi.reducerPath]: questionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionsApi.middleware),
});

