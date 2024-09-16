import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentBranch: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
    clearBranch: (state) => {
      state.currentBranch = null;
    },
  },
});

export const { setBranch, clearBranch } = branchSlice.actions;
export default branchSlice.reducer;
