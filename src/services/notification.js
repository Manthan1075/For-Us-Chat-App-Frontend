import axios from "axios";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export const enableNotification = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const register = await navigator.serviceWorker.register("/sw.js");

        await navigator.serviceWorker.ready;

        const publicKey = `${import.meta.env.VITE_NOTIFICATION_PUBLIC_KEY}`;

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

       const res =  await axios.post(`${import.meta.env.VITE_SERVER_URL}/subscribe`, {
        subscription,
        userId : "691bfce4fec5b1e4a3e70594",
    });
        console.log("Notification Enable :",res.data);
        
    } catch (err) {
        console.error("Push error:", err);
    }
};
