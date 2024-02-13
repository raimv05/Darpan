import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const initialState = {
  display: true,
  title: "",
  datetime: "",
  section: 1,
  duration: "",
  sections: [
    {
      question_count: "",
      marks: "",
      negative: "",
      questions: [],
    },
    {
      question_count: "",
      marks: "",
      negative: "",
      questions: [],
    },
    {
      question_count: "",
      marks: "",
      negative: "",
      questions: [],
    },
  ],
};

export const testSlice = createSlice({
  name: "test",
  initialState: initialState,
  reducers: {
    updatetest: (state, action) => {
      return produce(state, (draftState) => {
        Object.assign(draftState, action.payload);
      });
    },
    resettest: () => {
      return initialState; // Simply return the initial state
    },
  },
});

export const { updatetest, resettest } = testSlice.actions;

export default testSlice.reducer;
