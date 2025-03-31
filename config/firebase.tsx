
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMi_zTulMMCcKG97nccwkNpuAdRstCJt4",
  authDomain: "sprouts-final.firebaseapp.com",
  projectId: "sprouts-final",
  storageBucket: "sprouts-final.firebasestorage.app",
  messagingSenderId: "253715822034",
  appId: "1:253715822034:web:d856e8faf400f1cc09040b",
  measurementId: "G-TCTP62NLKH"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);