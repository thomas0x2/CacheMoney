// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChJ7L6QZJLdXd5JOr5HwkLFocXXw4hRVk",
  authDomain: "cachemoney-95b14.firebaseapp.com",
  projectId: "cachemoney-95b14",
  storageBucket: "cachemoney-95b14.appspot.com",
  messagingSenderId: "610421834160",
  appId: "1:610421834160:web:4c8a93de0e605102db5675",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
