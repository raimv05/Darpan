import React from "react";

const Tests = () => {
  return (
    <div className="right-bx">
      <div className="test-subhead" style={{ background: "#e7e7e7" }}>
        <p>Duration: {} Min</p>
        <p>Questions: </p>
        <p>Marks: </p>
      </div>
      <div className="input-container">
        <p>
          <span>
            Question : <input type="text" value="" />
          </span>
          <span>
            Options:
            <select>
              <option value={2}>Two </option>
              <option value={3}>Three</option>
              <option value={4}>Four</option>
              <option value={5}>Five</option>
            </select>
          </span>
        </p>
        <div key="" className="option-con">
          <span>Options :</span>
          <input className="option-entry" value="" />
          <label>
            Is Correct:
            <input type="checkbox" checked="" />
          </label>
        </div>

        <div className="button-container">
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Tests;
