// reducers/userReducer.js
import { createReducer } from "@reduxjs/toolkit";
import { setUser, clearUser, toggleTableRefresh } from "../slices/UserSlicer";

// Initial state for the user
const initialState = { name: "", id: null, branch: null, refreshTable: false };

// Create a reducer using createReducer from Redux Toolkit
export const userReducer = createReducer(initialState, (builder) => {
  console.log("Initial User State:", initialState);
  builder
    .addCase(setUser, (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.branch = action.payload.branch;
      state.employee_name = action.payload.employee_name;
      state.employee_mobile = action.payloademployee_mobile;
      state.employee_designation = action.payload.employee_designation;
      state.allow_insurance = action.payload.allow_insurance;
      state.doctor_payment = action.payload.doctor_payment;
      state.sharemail = action.payload.sharemail;
      state.sharewhatsapp = action.payload.sharewhatsapp;
      state.sharesms = action.payload.sharesms;
      state.branch_email = action.payload.branch_email;
      state.hospital_name = action.payload.hospital_name;
      state.branch_address = action.payload.branch_address;
      state.branch_contact = action.payload.branch_contact;
      state.token = action.payload.token;
      console.log("User State after setUser:", state);
    })
    .addCase(clearUser, (state) => {
      state.name = "";
      state.id = null;
      state.branch = null;
      state.employee_name = null;
      state.employee_mobile = null;
      state.employee_designation = null;
      state.allow_insurance = null;
      state.doctor_payment = null;
      state.sharemail = null;
      state.sharewhatsapp = null;
      state.sharesms = null;
      state.branch_email = null;
      state.hospital_name = null;
      state.branch_address = null;
      state.branch_contact = null;
      state.token = null;
    })
    .addCase(toggleTableRefresh, (state) => {
      state.refreshTable = !state.refreshTable;
    });
});
