import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/testlister.css";
const TestLister = () => {
  const [activeSection, setActiveSection] = useState("explorersQuest");
  const [test, settest] = useState([]);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let res = await fetch("/api/avilable-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    let response = await res.json();
    console.log(response);
    settest(response.tests);
  };
  const [time, settime] = useState("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const currentMilliseconds = currentTime.toLocaleString();
      settime(currentMilliseconds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="test-lister-container">
      <div className="sidebar">
        <ul className="ul">
          <li className="li">
            <button
              className={`button ${
                activeSection === "explorersQuest" ? "active" : ""
              }`}
              onClick={() => setActiveSection("explorersQuest")}
            >
              Explorer's Quest
            </button>
          </li>
          <li className="li">
            <button
              className={`button ${
                activeSection === "tailoredChallenges" ? "active" : ""
              }`}
              onClick={() => setActiveSection("tailoredChallenges")}
            >
              Tailored Challenges
            </button>
          </li>
          <li className="li">
            <button
              className={`button ${
                activeSection === "creatorsLab" ? "active" : ""
              }`}
              onClick={() => setActiveSection("creatorsLab")}
            >
              Creator's Lab
            </button>
          </li>
        </ul>
      </div>

      <div className="content">
        <div
          className={`div ${
            activeSection === "explorersQuest" ? "active" : ""
          }`}
        >
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <label className="label">
                Test ID:
                <input className="input" type="text" />
              </label>
              <label className="label">
                Creator ID:
                <input className="input" type="text" />
              </label>
              <button
                className="submit-button"
                type="submit"
                onClick={handleFormSubmit}
              >
                Filter Tests
              </button>
            </div>
          </form>
          <p className="p">
            Embark on a journey of diverse challenges that span various topics
            and fields. Explore and test your knowledge across a wide spectrum
            of subjects.
          </p>

          {test.map((itm) => {
            return (
              <div className="test-card" key={itm.id}>
                <div className="card-details">
                  <div>
                    <strong>Test id:</strong> {itm.id}
                  </div>
                  <div>
                    <strong>Test Name:</strong> {itm.title}
                  </div>
                  <div>
                    <strong>Date&time:</strong>{" "}
                    {new Date(itm.datetime).toLocaleString()}
                  </div>
                  <div>
                    <strong>Negative Marking:</strong> Yes
                  </div>
                </div>
                <button className="card-button">
                  {`${new Date(time).getTime()} ${new Date(
                    itm.datetime
                  ).getTime()} ${
                    new Date(time).getTime() > new Date(itm.datetime).getTime()
                  }`}
                </button>
              </div>
            );
          })}
        </div>

        <div
          className={`div ${
            activeSection === "tailoredChallenges" ? "active" : ""
          }`}
        >
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <label className="label">
                Test ID:
                <input className="input" type="text" />
              </label>
              <label className="label">
                Creator ID:
                <input className="input" type="text" />
              </label>
              <button
                className="submit-button"
                type="submit"
                onClick={handleFormSubmit}
              >
                Filter Tests
              </button>
            </div>
          </form>
          <p className="p">
            Tailored challenges designed to test your skills in specific areas.
            Choose a challenge that aligns with your interests and expertise.
          </p>

          {/* Card Component */}
          <div className="test-card">
            <div className="card-details">
              <div>
                <strong>Test Name:</strong> Tailored Challenge 1
              </div>
              <div>
                <strong>Marks:</strong> 50
              </div>
              <div>
                <strong>Duration:</strong> 30 mins
              </div>
              <div>
                <strong>Negative Marking:</strong> No
              </div>
            </div>
            <button className="card-button">Attempt Test</button>
          </div>
        </div>

        <div
          className={`div ${activeSection === "creatorsLab" ? "active" : ""}`}
        >
          <p className="p">
            Unleash your creativity in the Creator's Lab. Design and share your
            own tests, and challenge others to explore your curated assessments.
            Be the architect of knowledge!
          </p>

          {/* Card Component */}
          <div className="test-card">
            <div className="card-details">
              <div>
                <strong>Test Name:</strong> Creator's Lab Test
              </div>
              <div>
                <strong>Marks:</strong> 75
              </div>
              <div>
                <strong>Duration:</strong> 45 mins
              </div>
              <div>
                <strong>Negative Marking:</strong> Yes
              </div>
            </div>
            <button className="card-button">Attempt Test</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLister;
