
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlFdfoJ36-da21SrG7T3Dez3OEyNWtm-g",
  authDomain: "spa-app-57d5c.firebaseapp.com",
  projectId: "spa-app-57d5c",
  storageBucket: "spa-app-57d5c.firebasestorage.app",
  messagingSenderId: "62371647868",
  appId: "1:62371647868:web:c7b786a61d5dd983a254f9",
  measurementId: "G-01HN0ZEXW3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);