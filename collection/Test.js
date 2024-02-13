const {
  query,
  where,
  getDocs,
  limit,
  doc,
  getDoc,
  orderBy
} = require("firebase/firestore/lite");
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

const getAllTests = async (userId = null, testId = null) => {
  try {
    let q;

    if (testId) {
      const testDocRef = doc(Test, testId);
      const testDocSnapshot = await getDoc(testDocRef);

      if (testDocSnapshot.exists()) {
        const test = { id: testDocSnapshot.id, ...testDocSnapshot.data() };

        if (compareAsc(parseISO(test.datetime), new Date()) > 0) {
          return [test];
        } else {
          return [];
        }
      } else {
        return [];
      }
    } else if (userId) {
      q = query(
        Test,
        where("creator_id", "==", userId),
        where("datetime", ">", new Date().toISOString()),
        orderBy("datetime"), // Sort by datetime
        limit(15)
      );
    } else {
      q = query(
        Test,
        where("datetime", ">", new Date().toISOString()),
        orderBy("datetime"), // Sort by datetime
        limit(15)
      );
    }

    const querySnapshot = await getDocs(q);
    const tests = [];

    querySnapshot.forEach((doc) => {
      const test = { id: doc.id, ...doc.data() };

      if (compareAsc(parseISO(test.datetime), new Date()) > 0) {
        tests.push(test);
      }
    });

    return tests;
  } catch (error) {
    throw error;
  }
};

module.exports = { Test, addTest, getAllTests };
