import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

// === === === importing pages === === === //
import ErrorPage from "./components/pages/Errorpage";
import Home from "./components/pages/Home.jsx";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Createtest from "./components/pages/Createtest";
import Profilepage from "./components/pages/Profilepage";
import Psycometric from "./components/pages/Psycometric";
import Nav from "./components/templates/Nav";
import Testlister from "./components/pages/Testlister";
import Uploadtest from "./components/pages/Uploadtest";
// === === === Ends here === === === //

const root = ReactDOM.createRoot(document.getElementById("root"));

// === === === configuring router === === === //
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/Signup" element={<Signup />} />
          <Route exact path="/newtest" element={<Createtest />} />
          <Route exact path="/uploadtest" element={<Uploadtest />} />
          <Route exact path="/profile" element={<Profilepage />} />
          <Route exact path="/psycometric" element={<Psycometric />} />
          <Route exact path="/available-tests" element={<Testlister />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </>
    </Provider>
  </BrowserRouter>
);
