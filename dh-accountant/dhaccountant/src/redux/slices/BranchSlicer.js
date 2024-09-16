// import { createSlice } from "@reduxjs/toolkit";

// const branchSlice = createSlice({
//   name: "branch",
//   initialState: { name: null },
//   reducers: {
//     setBranch: (state, action) => {
//       state.name = action.payload.name;
//     },
//   },
// });

// // console.log(setUser);

// export const { setBranch } = branchSlice.actions;
// export default branchSlice.reducer;

// ------------------------------------------------
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchData: {},
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch(state, action) {
      state.branchData = action.payload;
    },
    clearBranch(state) {
      state.branchData = {};
    },
  },
});

export const { setBranch, clearBranch } = branchSlice.actions;

export default branchSlice.reducer;
