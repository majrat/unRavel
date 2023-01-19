import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMDIERjXXJC9zAW49ojr5svlo-HFjsQbs",
  authDomain: "unravel-88b40.firebaseapp.com",
  projectId: "unravel-88b40",
  storageBucket: "unravel-88b40.appspot.com",
  messagingSenderId: "17857497466",
  appId: "1:17857497466:web:0ba35f2795c891b9702ec3",
};

// Initialize Firebase and Firebase Authentication
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export {auth}
