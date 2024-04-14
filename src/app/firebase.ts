import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import { ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC4-Y8jHfvKjDr-XwpFAivxF-9vZvYWrDs",
  authDomain: "home-guru-114b5.firebaseapp.com",
  projectId: "home-guru-114b5",
  storageBucket: "home-guru-114b5.appspot.com",
  messagingSenderId: "726917833230",
  appId: "1:726917833230:web:f77553383eb846c0f9525f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);