import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

console.log("Fire Base Key :", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBR3aRlw1d-NTZDVLlqN3Z7aPO55FSY_HU',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'for-us-efb0f.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "for-us-efb0f",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '958026068536' ,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || 'BDENJhczjjI8y0Z6tK-abm1fYtN6jSWY38MjSGWy1U5bNZyRxrgbRrk6Zhz5PZph0HEGsoQpVap0lLwwc1C0SOs',
};
console.log("Fire Base Config :",firebaseConfig);



const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
