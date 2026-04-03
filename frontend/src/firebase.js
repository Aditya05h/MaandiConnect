import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCTddcYGsxOmtz8T7wzEFZGjpSvEe_AJV0",
    authDomain: "maandiconnect.firebaseapp.com",
    projectId: "maandiconnect",
    storageBucket: "maandiconnect.firebasestorage.app",
    messagingSenderId: "413944467279",
    appId: "1:413944467279:web:4bb45a49e60a78a41d3f3a"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);