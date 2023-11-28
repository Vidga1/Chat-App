import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from 'firebase/database';
import { Message } from './redux/actions'

const firebaseConfig = {
  apiKey: "AIzaSyDKZKeg6K2sigOpadWaKUCdOesIl22aPHk",
  authDomain: "chat-app-cf4e2.firebaseapp.com",
  projectId: "chat-app-cf4e2",
  storageBucket: "chat-app-cf4e2.appspot.com",
  messagingSenderId: "736647861908",
  appId: "1:736647861908:web:48ba916fac13d38aed0681",
  measurementId: "G-6QYB0Q1XR2",
};

export const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const writeData = (path: string, data: Message) => {
  set(ref(database, path), data);
};