import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./Function/Signup";
import userReducer from "./Function/User";
import testReducer from "./Function/Test"

export default configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    test:testReducer,

  },
});
