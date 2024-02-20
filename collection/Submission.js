const {
  query,
  where,
  getDocs,
  limit,
  doc,
  getDoc,
  orderBy,
} = require("firebase/firestore/lite");
const db = require("../firebase/config");
const { collection, addDoc } = require("firebase/firestore/lite");

const Submission = collection(db, "Submission");

const addSubmission = async (submissiondata) => {
  try {
    const docRef = await addDoc(Submission, { ...submissiondata });
    return { result: true };
  } catch (error) {
    throw error;
  }
};

const getAllSubmission = async () => {
  try {
    const querySnapshot = await getDocs(Submission);
    const tests = [];
    querySnapshot.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() });
    });
    return tests;
  } catch (error) {
    throw error;
  }
};
const searchSubmission = async (criteria) => {
  try {
    let queryRef = Submission;

    // Construct the query based on the provided criteria
    if (criteria.email) {
      queryRef = query(queryRef, where("email", "==", criteria.email));
    }
    if (criteria.schoolName) {
      queryRef = query(
        queryRef,
        where("schoolName", "==", criteria.schoolName)
      );
    }
    if (criteria.schoolCode) {
      queryRef = query(
        queryRef,
        where("schoolCode", "==", criteria.schoolCode)
      );
    }

    const querySnapshot = await getDocs(queryRef);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return submissions;
  } catch (error) {
    throw error;
  }
};
module.exports = { Submission, addSubmission, getAllSubmission, searchSubmission };
