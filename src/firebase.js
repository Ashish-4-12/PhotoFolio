
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG7qMoU_ywFf3PmWIc4DVn8iGgDQOOgE8",
    authDomain: "cnrjs-5298a.firebaseapp.com",
    projectId: "cnrjs-5298a",
    storageBucket: "cnrjs-5298a.appspot.com",
    messagingSenderId: "429997517455",
    appId: "1:429997517455:web:8348e0010d4a70adf8defa",
    measurementId: "G-GDR0D6G8GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);