// ProfilePage.js
import React, { useState } from "react";
import "./css/profilepage.css";

const initialProfileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  // Add more profile information as needed
};

const Profilepage = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [activeSection, setActiveSection] = useState("profileDetails");
  const [activeTab, setActiveTab] = useState("first");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleProfileUpdate = () => {
    // Implement profile update logic here
    console.log("Profile updated:", { newName, newEmail });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    // Implement password reset logic here
    console.log("Password reset:", { password, confirmPassword });
  };

  return (
    <>
      <h1 className="user-head">User Profile</h1>
      <div className="profile-container">
        <div className="profile-image">
          <img
            src="https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
            alt="User Profile Image"
          />
        </div>
        <div className="profile-details">
          <h2>Joel Taylor</h2>
          <p>
            <b>Age:</b> 23
          </p>
          <p>
            <b>Gender:</b> Male
          </p>
          <p>
            <b>Email:</b> user@example.com
          </p>
          <p>
            <b>Majors:</b> Btech Computer Science
          </p>
          <p>
            <b>University Name:</b> GLA University Mathura
          </p>
          <p>
            <b>Semester:</b>3
          </p>
          <p>
            <b>Contact No:</b> 9876543211
          </p>
        </div>
      </div>
      <div>
        <div className="tab-container">
          <div
            className={`tab ${activeTab === "first" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("first")}
          >
            Profile Update
          </div>
          <div
            className={`tab ${activeTab === "second" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("second")}
          >
            Reset Password
          </div>
          <div
            className={`tab ${activeTab === "third" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("third")}
          >
            Test History
          </div>
        </div>

        <div
          id="first-content"
          className={`tab-content ${
            activeTab === "first" ? "active-content" : ""
          }`}
        >
          <h2>Profile Update</h2>
          <div className="profile-update-form">
            <label htmlFor="newName">New Name:</label>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <label htmlFor="newEmail">New phone:</label>
            <input
              type="tel"
              id="newPhone"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <label htmlFor="prodile">New profile:</label>
            <input type="file" id="profile" name="profile" />
            <button onClick={handleProfileUpdate} className="profile_button">Update Profile</button>
          </div>
        </div>

        <div
          id="second-content"
          className={`tab-content ${
            activeTab === "second" ? "active-content" : ""
          }`}
        >
          <h2>Reset Password</h2>
          <div className="reset-password-form">
            <label htmlFor="password">Old Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleResetPassword} className="profile_button">Reset Password</button>
          </div>
        </div>

        <div
          id="third-content"
          className={`tab-content ${
            activeTab === "third" ? "active-content" : ""
          }`}
        >
          <h2>Test History</h2>
          <p>Test History Will appear hear</p>
        </div>
      </div>
    </>
  );
};

export default Profilepage;
