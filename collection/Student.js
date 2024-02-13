const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} = require("firebase/firestore/lite");
const db = require("../firebase/config");
const bcrypt = require("bcrypt");

const Students = collection(db, "Student");

const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(Students, {
      ...studentData,
    });
    return { result: true };
  } catch (error) {
    throw error;
  }
};

const getStudentByEmail = async (email) => {
  try {
    const q = query(Students, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let student = null;
    querySnapshot.forEach((doc) => {
      student = { id: doc.id, ...doc.data() };
    });
    return student;
  } catch (error) {
    throw error;
  }
};

module.exports = { addStudent, getStudentByEmail };
