import React from "react";
import "./css/newtest.css";
import { useSelector, useDispatch } from "react-redux";
import { updatetest } from "../../Function/Test";
import { useNavigate } from "react-router-dom";

const Newtest = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const test = useSelector((state) => state.test);
  return (
    <>
      <div className="form-popup-bg is-visible">
        <div className="form-container">
        <a
          className="closer"
          onClick={() => {
            Navigate(-1)
          }}
        >
          <ion-icon name="arrow-back-outline"></ion-icon>
        </a>
          <h1>Create new test</h1>
          <p>
            marks:{" "}
            {test.sections[0].question_count * test.sections[0].marks +
              test.sections[1].question_count * test.sections[1].marks +
              test.sections[2].question_count * test.sections[2].marks}
          </p>
          <form action="">
            <div className="form-group">
              <label for="">Test Title</label>
              <input
                type="text"
                className="form-control"
                value={test.title}
                onChange={(e) => {
                  dispatch(updatetest({ title: e.target.value }));
                }}
              />
            </div>
            <div className="form-group">
              <label for="">Test date & time</label>
              <input
                className="form-control"
                type="datetime-local"
                onChange={(e) => {
                  dispatch(updatetest({ datetime: e.target.value }));
                }}
                value={test.datetime}
              />
            </div>
            <div className="form-group">
              <label for="">Test Duration ( in min )</label>
              <input
                className="form-control"
                type="number"
                value={test.duration}
                onChange={(e) =>
                  dispatch(updatetest({ duration: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label for="">Sections</label>
              <select
                className="form-control"
                style={{ width: "100%" }}
                value={test.section}
                onChange={(e) =>
                  dispatch(updatetest({ section: e.target.value }))
                }
              >
                <option value="1">No Section</option>
                <option value="2">Two Section</option>
                <option value="3">Three Section</option>
              </select>
            </div>
            {test.section == "1" ? "" : <p>Section One</p>}
            <div className="form-group">
              <label for="">Total question</label>
              <input
                className="form-control"
                type="number"
                value={test.sections[0].question_count}
                onChange={(e) => {
                  dispatch(
                    updatetest({
                      sections: [
                        { ...test.sections[0], question_count: e.target.value },
                        ...test.sections.slice(1),
                      ],
                    })
                  );
                }}
              />
            </div>
            <div className="form-group">
              <label for="">Marks for correct answer</label>
              <input
                className="form-control"
                type="number"
                value={test.sections[0].marks}
                onChange={(e) => {
                  dispatch(
                    updatetest({
                      sections: [
                        { ...test.sections[0], marks: e.target.value },
                        ...test.sections.slice(1),
                      ],
                    })
                  );
                }}
              />
            </div>
            <div className="form-group">
              <label for="">Negative Marks for incorrect answer</label>
              <input
                className="form-control"
                type="number"
                placeholder="if any"
                value={test.sections[0].negative}
                onChange={(e) => {
                  dispatch(
                    updatetest({
                      sections: [
                        { ...test.sections[0], negative: e.target.value },
                        ...test.sections.slice(1),
                      ],
                    })
                  );
                }}
              />
            </div>
            {test.section === "2" || test.section == "3" ? (
              <>
                <p>Section Two</p>
                <div className="form-group">
                  <label htmlFor="">Total question</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[1].question_count}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 1),
                            {
                              ...test.sections[1],
                              question_count: e.target.value,
                            },
                            ...test.sections.slice(2),
                          ],
                        })
                      );
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Marks for correct answer</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[1].marks}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 1),
                            { ...test.sections[1], marks: e.target.value },
                            ...test.sections.slice(2),
                          ],
                        })
                      );
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Negative Marks for incorrect answer</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[1].negative}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 1),
                            { ...test.sections[1], negative: e.target.value },
                            ...test.sections.slice(2),
                          ],
                        })
                      );
                    }}
                    placeholder="if any"
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {test.section === "3" ? (
              <>
                <p>Section Three</p>
                <div className="form-group">
                  <label htmlFor="">Total question</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[2].question_count}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 2),
                            {
                              ...test.sections[2],
                              question_count: e.target.value,
                            },
                          ],
                        })
                      );
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Marks for correct answer</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[2].marks}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 2),
                            { ...test.sections[2], marks: e.target.value },
                          ],
                        })
                      );
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Negative Marks for incorrect answer</label>
                  <input
                    className="form-control"
                    type="number"
                    value={test.sections[2].negative}
                    onChange={(e) => {
                      dispatch(
                        updatetest({
                          sections: [
                            ...test.sections.slice(0, 2),
                            { ...test.sections[2], negative: e.target.value },
                          ],
                        })
                      );
                    }}
                    placeholder="if any"
                  />
                </div>
              </>
            ) : (
              ""
            )}

            <button
              className="create-btn"
              onClick={(e) => {
                e.preventDefault();
                dispatch(updatetest({ display: test.title ? false : true }));
              }}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Newtest;
