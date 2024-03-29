const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  google_login_url,
  google_handel_token,
  logout,
  upload_test,
  get_test,
  registerStudent,
  submission,
  get_submission,
} = require("../controller/api_cont");
const auth = require("../middleware/auth");
// === === === Demo === === == //

router.post("/call", auth, registerStudent);

// === === === register === === === //

router.post("/register", register);

// === === === login === === === //

router.post("/login", login);

// === === === profile === === === //

router.get("/authenticate", auth, profile);

// === === === login url === === === //

router.get("/auth/google/url", google_login_url);

// === === === user data fom google === === === //

router.get("/auth/google", google_handel_token);

// === === === logout === === === //

router.get("/logout", auth, logout);

// === === === get test === === === //

router.get("/avilable-test", auth, get_test);

// === === === get profile === === === //

router.get("/profile", auth, profile);

// === === === submit === === === //

router.post("/test/submmit", auth, submission);

// === === === search submission === === === //

router.get("/search", auth, get_submission);

module.exports = router;
