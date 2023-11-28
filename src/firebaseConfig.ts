import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKZKeg6K2sigOpadWaKUCdOesIl22aPHk",
  authDomain: "chat-app-cf4e2.firebaseapp.com",
  projectId: "chat-app-cf4e2",
  storageBucket: "chat-app-cf4e2.appspot.com",
  messagingSenderId: "736647861908",
  appId: "1:736647861908:web:48ba916fac13d38aed0681",
  measurementId: "G-6QYB0Q1XR2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
