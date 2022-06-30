import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyB1fbHA9_uHE-YCUGyvxAniD2ouZ2-UvFU",
  authDomain: "bsm-project-test.firebaseapp.com",
  projectId: "bsm-project-test",
  storageBucket: "bsm-project-test.appspot.com",
  messagingSenderId: "761641531950",
  appId: "1:761641531950:web:56a62b6c9dc9f57df13dbf",
});

// Export the database for components to use.
export const storage = firebaseConfig.storage();

