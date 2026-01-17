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

  const notificationTitle =
    payload.notification?.title || "New Notification";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/assets/Logo.png",

    tag: "main-notification",
    renotify: false,

    image: payload.notification?.image || undefined,

    data: {
      url:
        payload?.data?.url ||
        payload?.fcmOptions?.link ||
        "/",
    },

    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});


self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
