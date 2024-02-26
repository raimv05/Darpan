import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/tests.css";

function Tests() {
  const [testData, setTestData] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/avilable-test", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let data = await response.json();
        if (data.tests) {
          setTestData(data.tests);
          setSelectedOptions(
            new Array(data.tests[0].question.length).fill(null)
          );
        }
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOptionChange = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestionIndex] = index;
    setSelectedOptions(updatedSelectedOptions);
    setIsOptionSelected(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setIsOptionSelected(false); // Reset option selected state for the next question
  };
  const handleSubmit = async () => {
    try {
      let s = 0;
      selectedOptions.forEach((i) => {
        s += i;
      });
      const response = await fetch("/api/test/submmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sum: s,
          selectedOptions,
        }),
      });
      let res = await response.json();
      if (response.status === 201) {
        alert("Subbmited");
        // Navigate("/");
      } else {
        return alert(res.message);
      }
    } catch (error) {}
  };
  return (
    <>
      {testData ? (
        <div className="mcq-container">
          <h2 className="question">
            {testData.question[currentQuestionIndex].que}
          </h2>
          <ul className="options">
            {testData.question[currentQuestionIndex].options.map(
              (option, index) => (
                <li key={index} className="option">
                  <input
                    type="radio"
                    className="radio-input"
                    name={`question-${currentQuestionIndex + 1}`}
                    checked={
                      selectedOptions[currentQuestionIndex] === index + 1
                    }
                    onChange={() => handleOptionChange(index + 1)}
                  />
                  <label>{option.ans}</label>
                </li>
              )
            )}
          </ul>
          {currentQuestionIndex < testData.question.length - 1 ? (
            <button
              className="submit-button"
              onClick={handleNextQuestion}
              disabled={!isOptionSelected}
            >
              Next
            </button>
          ) : (
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={!isOptionSelected}
            >
              Submit
            </button>
          )}
        </div>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </>
  );
}

export default Tests;
