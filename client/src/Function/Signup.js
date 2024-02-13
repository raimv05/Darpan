import { createSlice } from "@reduxjs/toolkit";

export const signupSlice = createSlice({
  name: "signup",
  initialState: {
    email: "",
    name: "",
    phone: "",
    password: "",
    cPassword: "",
  },
  reducers: {
    u_email: (state, action) => {
      state.email = action.payload;
    },
    u_name: (state, action) => {
      state.name = action.payload;
    },
    u_phone: (state, action) => {
      state.phone = action.payload;
    },
    u_password: (state, action) => {
      state.password = action.payload;
    },
    u_cpassword: (state, action) => {
      state.cPassword = action.payload;
    },
  },
});
export const { u_email, u_cpassword, u_name, u_phone, u_password } = signupSlice.actions;

export default signupSlice.reducer;
