// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVaDjS5tm2TXVxoMrhCXrc2Pr2T7c7zNs",
  authDomain: "kiwitter-2fece.firebaseapp.com",
  projectId: "kiwitter-2fece",
  storageBucket: "kiwitter-2fece.appspot.com",
  messagingSenderId: "189861971724",
  appId: "1:189861971724:web:e84fe9b292bc70effe2b29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);