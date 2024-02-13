require("dotenv").config()
const express = require("express");
const app = express();
const cookie_par = require("cookie-parser");
app.use(express.json());
app.use(cookie_par());

// === === === routes === === === //

app.use("/api", require("./routers/api"));

// === === === listining === === === //

app.listen(4000, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("listining to port number 4000");
  }
});
