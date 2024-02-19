import React, { useState, useEffect } from "react";
//import "../pages/css/tests.css"; // Import the CSS file

function Tests() {
  const [testData, setTestData] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);

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

  const handleSubmit = () => {
    console.log("Selected options:", selectedOptions);
  };

  console.log(selectedOptions);

  return (
    <>
      {testData ? (
        <div className="mcq-container">
          <h2 className="question">
            {testData[0].question[currentQuestionIndex].que}
          </h2>
          <ul className="options">
            {testData[0].question[currentQuestionIndex].options.map(
              (option, index) => (
                <li key={index} className="option">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    checked={selectedOptions[currentQuestionIndex] === index}
                    onChange={() => handleOptionChange(index)}
                  />
                  <label>{option.ans}</label>
                </li>
              )
            )}
          </ul>
          {currentQuestionIndex < testData[0].question.length - 1 ? (
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
<<<<<<< HEAD
      ) : (
        <div className="loader">Loading...</div>
      )}
    </>
=======

        <div className="button-container">
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
>>>>>>> 5bbd460d215c2e41847f5d42956cb3d0d639f7b8
  );
}

export default Tests;