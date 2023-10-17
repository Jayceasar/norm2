import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwjLt2isexFZFWw_rnOuRi3rqOg1Gt6aY",
  authDomain: "normnewest.firebaseapp.com",
  projectId: "normnewest",
  storageBucket: "normnewest.appspot.com",
  messagingSenderId: "130767732999",
  appId: "1:130767732999:web:a214f23d8a5817c968c5a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
