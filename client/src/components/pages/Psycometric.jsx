import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tests from "./Tests";

import "./css/createtest.css";
import validator from "validator";

const Createtest = () => {
  let data = useSelector((state) => state.user);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    dob: "",
    Class: "",
    gender: "",
    schoolName: "",
    schoolCode: "",
  });

  useEffect(() => {
    if (!data.email && !data.loading) {
      Navigate("/");
    }
  }, [data]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  const [view, setview] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Validate that all fields are filled
    const { phone, dob, Class, gender, schoolName, schoolCode } = formData;
    if (!validator.isMobilePhone(phone, "en-IN")) {
      return alert("please enter  a valid phone number");
    }
    const response = await fetch("/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        dob,
        Class,
        gender,
        schoolName,
        schoolCode,
      }),
    });
    let res = await response.json();
    if (!res.result) {
      return alert("student registration failed");
    } else {
      setview(false);
    }
  };

  return (
    <>
      {view ? (
        <div className="Createtest">
          <div className="Ctest-main">
            <div className="left-bx">
              <div className="section-tgl" onClick={toggleForm}>
                Fill Up Details
              </div>
              <br />
              {showForm && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth:</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Class:</label>
                    <input
                      type="text"
                      name="Class"
                      value={formData.Class}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender:</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </form>
              )}
            </div>
            <div className="right-bx">
              {showForm && (
                <div className="additional-details">
                  <div className="form-group">
                    <label>School Name:</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>School Code:</label>
                    <input
                      type="text"
                      name="schoolCode"
                      value={formData.schoolCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="button-submit-container">
                    <button type="submit" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Tests />
      )}
    </>
  );
};

export default Createtest;
