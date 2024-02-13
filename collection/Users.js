const bcrypt = require("bcrypt");
const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
} = require("firebase/firestore/lite");
const db = require("../firebase/config");

const Users = collection(db, "Users");

const addUser = async (userData) => {
  try {
    const docRef = await addDoc(Users, {
      ...userData,
      email: userData.email.toLowerCase(),
      password: await bcrypt.hash(userData.password, 12),
      registrationDate: new Date().toLocaleString(),
      verification: {
        email: userData.verification
          ? userData.verification.email
          : false || false,
      },
    });
    return { result: true };
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const q = query(Users, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      return { result: false };
    }
    const userDoc = querySnapshot.docs[0];
    return { result: true, user: { id: userDoc.id, ...userDoc.data() } };
  } catch (error) {
    throw error;
  }
};
const getUserByPhone = async (phone) => {
  try {
    const q = query(Users, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      return { result: false };
    }
    const userDoc = querySnapshot.docs[0];
    return { result: true, user: { id: userDoc.id, ...userDoc.data() } };
  } catch (error) {
    throw error;
  }
};

const updateuser = async (updatedUser) => {
  try {
    const q = query(Users, where("email", "==", updatedUser.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      return { result: false, message: "User not found with the given email." };
    }
    const userDoc = querySnapshot.docs[0];
    await setDoc(userDoc.ref, updatedUser, { merge: true });
    return { result: true, message: "User updated successfully." };
  } catch (error) {
    throw error;
  }
};

module.exports = { Users, addUser, getUserByEmail, getUserByPhone, updateuser };
