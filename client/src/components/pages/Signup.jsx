import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  u_email,
  u_password,
  u_cpassword,
  u_name,
  u_phone,
} from "../../Function/Signup";
import validator from "validator";
import { useEffect } from "react";

const Signup = () => {
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user.email) {
      Navigate("/");
    }
  }, [user]);
  const data = useSelector((state) => state.signup);

  const dispatch = useDispatch();

  const register = async (e) => {
    e.preventDefault();
    const { email, name, phone, cPassword, password } = data;
    if (!email || !validator.isEmail(email)) {
      return alert("Please provide a valid email")
    } else if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
      return alert("Please provide a valid Mobile number")
    } else if (!password || !cPassword) {
      return alert("Please input every field");
    } else if (password !== cPassword) {
      return alert("Both password must be identical");
    } else if (!validator.isStrongPassword(password)) {
      return alert("Please enter a strong password");
    }
    const response = await fetch("/api/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        cpassword: cPassword,
        name,
        phone,
      }),
    });
    let res = await response.json();
    if (response.status === 201) {
      alert("registered successfully");
      Navigate("/login");
    } else {
      return alert(res.message);
    }
  };
  const signupwithgoogle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/google/url", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data = await response.json();
      window.location.replace(data.url);
    } catch (error) {
      return alert("Some error occured");
    }
  };
  return (
    <>
      <div className="flxcenter" style={{ marginTop: "130px" }}>
        <div className="wrapper">
          <form>
            <h1>Sign up</h1>
            <div className="input">
              <input
                className="input-box"
                type="text"
                placeholder="Full Name"
                value={data.name}
                onChange={(e) => {
                  dispatch(u_name(e.target.value));
                }}
              />
            </div>
            <div className="input">
              <input
                className="input-box"
                type="text"
                placeholder="Phone number"
                value={data.phone}
                onChange={(e) => {
                  dispatch(u_phone(e.target.value));
                }}
              />
            </div>
            <div className="input">
              <input
                className="input-box"
                type="text"
                placeholder="Email"
                value={data.email}
                onChange={(e) => {
                  dispatch(u_email(e.target.value));
                }}
              />
            </div>
            <div className="input">
              <input
                className="input-box"
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => {
                  dispatch(u_password(e.target.value));
                }}
              />
            </div>
            <div className="input">
              <input
                className="input-box"
                type="password"
                placeholder="Confirm Password"
                value={data.cPassword}
                onChange={(e) => {
                  dispatch(u_cpassword(e.target.value));
                }}
              />
            </div>
            <button type="submit" className="login-btn-1" onClick={register}>
              Sign up
            </button>
            <p>
              <button
                type="button"
                className="login-btn"
                onClick={signupwithgoogle}
              >
                <ion-icon name="logo-google" className="s-icon"></ion-icon>
                <p className="signin-para">Signup with Google</p>
              </button>
              <br />
              Already have an account?
              <Link to="/login">login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
