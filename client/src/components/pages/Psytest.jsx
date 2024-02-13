import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { update } from "../../Function/User";
import Newtest from "../templates/Newtest";
import "./css/createtest.css";
import { updatetest, resettest } from "../../Function/Test";

const Createtest = () => {
  let data = useSelector((state) => state.user);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  let test = useSelector((state) => state.test);
  useEffect(() => {
    if (!data.email && !data.loading) {
      Navigate("/");
    }
  }, [data]);

  const [questionIndex, setQuestionIndex] = useState(0);

  const [question, setQuestion] = useState({
    index: 0,
    question: "",
    option_count: 2,
    options: [
      {
        text: "",
        iscorrect: false,
      },
    ],
    multi_correct: false,
  });

  const [selectedSection, setSelectedSection] = useState(1);
  const handleChange = (event, property, optionIndex, subProperty) => {
    const { value, checked } = event.target;

    setQuestion((prevQuestion) => {
      if (property === "options") {
        const updatedOptions = [...prevQuestion.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          [subProperty]: subProperty === "iscorrect" ? checked : value,
        };

        // Check if multiple correct options are selected
        const isMultiCorrect =
          updatedOptions.filter((option) => option.iscorrect).length > 1;

        return {
          ...prevQuestion,
          [property]: updatedOptions,
          multi_correct: isMultiCorrect,
        };
      }
      return { ...prevQuestion, [property]: value };
    });
  };

  const handleSectionChange = (event) => {
    setSelectedSection(parseInt(event.target.value));
    setQuestion({
      ...question,
      index: test.sections[parseInt(event.target.value) - 1].questions.length,
    });
    setQuestionIndex(
      test.sections[parseInt(event.target.value) - 1].questions.length
    );
  };

  const handleAddOrUpdateQuestion = () => {
    const selectedSectionIndex = selectedSection - 1;
    const currentQuestions = test.sections[selectedSectionIndex].questions;

    // Validation: Question and every option text must not be empty
    let que = question;
    while (que.option_count * 1 < que.options.length) {
      que.options.pop();
    }
    if (
      !que.question.trim() ||
      !que.options.every((option) => option.text.trim())
    ) {
      alert("Question and all options must have non-empty text.");
      return;
    }

    // Validation: At least 2 options are required
    if (que.options.length < 2) {
      alert("At least 2 options are required for each question.");
      return;
    }

    // Validation: No more than 5 options are allowed
    if (que.options.length > 5) {
      alert("Maximum 5 options are allowed for each question.");
      return;
    }

    // Validation: At least one option should have iscorrect set to true
    if (!que.options.some((option) => option.iscorrect)) {
      alert("At least one option must be marked as correct.");
      return;
    }

    const existingQuestionIndex = currentQuestions.findIndex(
      (q) => q.index === que.index
    );

    if (existingQuestionIndex !== -1) {
      // Update the existing question at its index
      dispatch(
        updatetest({
          sections: test.sections.map((section, index) =>
            index === selectedSectionIndex
              ? {
                  ...section,
                  questions: section.questions.map((q, i) =>
                    i === existingQuestionIndex ? que : q
                  ),
                }
              : section
          ),
        })
      );

      setQuestion({
        index: test.sections[selectedSectionIndex].questions.length,
        question: "",
        option_count: 2,
        options: [
          {
            text: "",
            iscorrect: false,
          },
        ],
        multi_correct: false,
      });
    } else {
      if (
        test.sections[selectedSectionIndex].questions.length >=
        test.sections[selectedSectionIndex].question_count
      ) {
        return alert("limit reached for this section");
      }
      const isMultiCorrect =
        que.options.filter((option) => option.iscorrect).length > 1;

      // Add the new question to the selected section
      dispatch(
        updatetest({
          sections: test.sections.map((section, index) =>
            index === selectedSectionIndex
              ? {
                  ...section,
                  questions: [
                    ...section.questions,
                    { ...question, multi_correct: isMultiCorrect },
                  ],
                }
              : section
          ),
        })
      );
      setQuestion({
        index: que.index + 1,
        question: "",
        option_count: 2,
        options: [
          {
            text: "",
            iscorrect: false,
          },
        ],
        multi_correct: false,
      });
    }

    // Move to the next question
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      // Move to the previous question
      setQuestionIndex((prevIndex) => prevIndex - 1);

      // Retrieve the data for the previous question from the test state
      const selectedSectionIndex = selectedSection - 1;
      const previousQuestion =
        test.sections[selectedSectionIndex].questions[questionIndex - 1];
      if (!previousQuestion) return;
      // Set the state to update the question
      setQuestion({
        index: previousQuestion.index,
        question: previousQuestion.question,
        option_count: previousQuestion.option_count,
        options: previousQuestion.options.map((option) => ({ ...option })),
        multi_correct: previousQuestion.multi_correct,
      });
    } else {
      alert("You have reached the beginning of the questions.");
    }
  };

  const handleNextQuestion = () => {
    const selectedSectionIndex = selectedSection - 1;
    const totalQuestions = test.sections[selectedSectionIndex].questions.length;

    if (questionIndex < totalQuestions - 1) {
      // Move to the next question
      setQuestionIndex((prevIndex) => prevIndex + 1);

      // Retrieve the data for the next question from the test state
      const nextQuestion =
        test.sections[selectedSectionIndex].questions[questionIndex + 1];

      // Set the state to update the question
      setQuestion({
        index: nextQuestion.index,
        question: nextQuestion.question,
        option_count: nextQuestion.option_count,
        options: nextQuestion.options.map((option) => ({ ...option })),
        multi_correct: nextQuestion.multi_correct,
      });
    } else {
      alert("You have reached the end of the questions.");
      console.log(test);
    }
  };
  function validateTest(test) {
    if (!test.title.trim()) {
      return "Test title cannot be empty.";
    }

    const testDatetime = new Date(test.datetime);
    if (!(testDatetime instanceof Date) || isNaN(testDatetime)) {
      return "Invalid datetime format or not a future date.";
    }

    const duration = parseInt(test.duration, 10);
    if (isNaN(duration) || duration <= 0) {
      return "Duration must be a positive number.";
    }

    const nonEmptySections = test.sections.filter(
      (section) => section.questions.length > 0
    );

    if (parseInt(test.section, 10) !== nonEmptySections.length) {
      return "Number of sections does not match the expected number specified.";
    }

    for (const section of nonEmptySections) {
      if (
        isNaN(parseInt(section.question_count, 10)) ||
        parseInt(section.question_count, 10) <= 0
      ) {
        return "Invalid question count for a section.";
      }

      if (
        section.marks.trim() === "" ||
        isNaN(parseInt(section.marks, 10)) ||
        parseInt(section.marks, 10) <= 0
      ) {
        return "Invalid marks for a section.";
      }

      const sectionNegative =
        section.negative.trim() === "" ? null : parseFloat(section.negative);
      if (
        sectionNegative !== null &&
        (isNaN(sectionNegative) ||
          sectionNegative < 0 ||
          sectionNegative > parseInt(section.marks, 10))
      ) {
        return "Invalid negative marking for a section.";
      }
    }

    for (const section of nonEmptySections) {
      for (const question of section.questions) {
        if (!question.question.trim()) {
          return "Question text cannot be empty.";
        }

        const optionCount = parseInt(question.option_count, 10);
        if (
          isNaN(optionCount) ||
          optionCount <= 0 ||
          optionCount !== question.options.length
        ) {
          return "Invalid option count for a question.";
        }

        for (const option of question.options) {
          if (!option.text.trim()) {
            return "Option text cannot be empty.";
          }

          // if (option.iscorrect !== undefined && option.iscorrect !== true) {
          //   return "At least one option must be marked as correct.";
          // }
        }
      }
    }

    const totalQuestions = nonEmptySections.reduce(
      (total, section) => total + section.questions.length,
      0
    );
    if (
      totalQuestions !==
      nonEmptySections.reduce(
        (total, section) => total + parseInt(section.question_count, 10),
        0
      )
    ) {
      return "Total number of questions does not match the sum of question counts in sections.";
    }

    return null;
  }

  const createtest = async () => {
    const validationError = validateTest(test);
    if (validationError) {
      alert(validationError);
      return;
    }

    const response = await fetch("/api/new/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(test),
    });

    let res = await response.json();
    dispatch(resettest());
    alert(res.message);
  };

  return (
    <>
      {!test.title || test.display ? <Newtest /> : ""}
      <div className="Createtest">
        <div className="Ctest-main">
          <div className="left-bx">
            <div className="test-subhead">
              <p>{test.title}</p>
              <button
                className="edit-test"
                onClick={() => dispatch(updatetest({ display: true }))}
              >
                Edit
              </button>
            </div>
            <div className="section-select">
              <label>Select Section:</label>
              <select value={selectedSection} onChange={handleSectionChange}>
                {Array.from({ length: test.section }, (_, index) => (
                  <option key={index} value={index + 1}>
                    Section {index + 1}
                  </option>
                ))}
              </select>
            </div>
            {test.section === 1 ? (
              <div className="section-tgl">
                Test paper |{" "}
                {`${test.sections[0].questions.length}/${
                  test.sections[0].question_count || 0
                }`}
              </div>
            ) : (
              Array.from({ length: test.section }, (_, index) => (
                <div
                  key={index}
                  className={
                    selectedSection - 1 == index
                      ? "section-tgl selected-tgl"
                      : "section-tgl"
                  }
                >
                  Section {index + 1} |{" "}
                  {`${test.sections[index].questions.length}/${
                    test.sections[index].question_count || 0
                  }`}
                </div>
              ))
            )}
            <div className="button-submit-container">
              <button className="" onClick={createtest}>
                Submit
              </button>
            </div>
          </div>

          <div className="right-bx">
            <div className="test-subhead" style={{ background: "#e7e7e7" }}>
              <p>Duration: {test.duration} Min</p>
              <p>
                Questions:{" "}
                {test.sections.reduce(
                  (total, section) => total + section.questions.length,
                  0
                )}
                /
                {test.sections.reduce(
                  (total, section) => total + section.question_count * 1,
                  0
                )}
              </p>
              <p>
                Marks:{" "}
                {test.sections.reduce(
                  (total, section) =>
                    total +
                    section.questions.length *
                      (section.marks || test.sections[0].marks),
                  0
                )}
              </p>
            </div>
            <div className="input-container">
              <p>
                <span>
                  Question :{" "}
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => {
                      handleChange(e, "question");
                    }}
                  />
                </span>
                <span>
                  Options:
                  <select
                    onChange={(e) => {
                      handleChange(e, "option_count");
                    }}
                  >
                    <option value={2}>Two </option>
                    <option value={3}>Three</option>
                    <option value={4}>Four</option>
                    <option value={5}>Five</option>
                  </select>
                </span>
              </p>
              {Array.from({ length: question.option_count }, (_, index) => (
                <div key={index} className="option-con">
                  <span>Options {index + 1}:</span>
                  <input
                    className="option-entry"
                    value={question.options[index]?.text || ""}
                    onChange={(e) => handleChange(e, "options", index, "text")}
                  />
                  <label>
                    Is Correct:
                    <input
                      type="checkbox"
                      checked={question.options[index]?.iscorrect || false}
                      onChange={(e) =>
                        handleChange(e, "options", index, "iscorrect")
                      }
                    />
                  </label>
                </div>
              ))}
              <div className="button-container">
                <button onClick={handlePreviousQuestion}>Previous</button>
                <button onClick={handleAddOrUpdateQuestion}>
                  {test.sections[selectedSection - 1].questions.length ==
                  question.index
                    ? "Add Question"
                    : `Update Question ${question.index + 1}`}
                </button>
                <button onClick={handleNextQuestion}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Createtest;
