const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore/lite");

const firebaseConfig = {
  apiKey: "AIzaSyA36_0HFoWE4F_meWRmLA0OK7uwk8fzzDY",
  authDomain: "pshyco-test.firebaseapp.com",
  databaseURL: "https://pshyco-test-default-rtdb.firebaseio.com",
  projectId: "pshyco-test",
  storageBucket: "pshyco-test.appspot.com",
  messagingSenderId: "624576921532",
  appId: "1:624576921532:web:6bffe5057c2dab768975b9",
  measurementId: "G-D33S2XM7KE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
