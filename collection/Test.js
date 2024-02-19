const { query, where, getDocs, limit, doc, getDoc, orderBy } = require("firebase/firestore/lite");
const { compareAsc, parseISO } = require("date-fns");
const db = require("../firebase/config");
const { collection, addDoc } = require("firebase/firestore/lite");

const Test = collection(db, "Test");

const addTest = async (testdata) => {
  try {
    const docRef = await addDoc(Test, { ...testdata });
    return { result: true };
  } catch (error) {
    throw error;
  }
};

const getAllTests = async () => {
  try {
    const querySnapshot = await getDocs(Test);
    const tests = [];
    querySnapshot.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() });
    });
    return tests;
  } catch (error) {
    throw error;
  }
};

module.exports = { Test, addTest, getAllTests };
