// src/redux/reducers/uiSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light", // or "dark"
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode, toggleMode } = uiSlice.actions;
export default uiSlice.reducer;
