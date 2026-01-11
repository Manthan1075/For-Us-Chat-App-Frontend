importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "dummy",
  projectId: "dummy",
  messagingSenderId: "dummy",
  appId: "dummy"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("BG Message", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/assets/Logo.png"
  });
});
