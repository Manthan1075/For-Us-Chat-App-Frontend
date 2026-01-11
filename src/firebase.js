import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

console.log("Fire Base Key :", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "for-us-efb0f",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log("Fire Base Config :",firebaseConfig);



const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
