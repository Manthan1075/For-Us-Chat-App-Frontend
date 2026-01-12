import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const enableNotification = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
    });

    console.log("FCM Token:", token);

    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/notification/subscribe`, {
      userId,
      token,
    });

    if (res.data.success) {
      alert("Notification enabled");
    } else {
      alert("Notification not enabled");
    }

  } catch (err) {
    console.error("Notification error:", err);
  }
};

export const listenToMessage = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    alert(payload.notification.title + " - " + payload.notification.body);
  });
};
