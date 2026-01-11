self.addEventListener("push", event => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Notification", body: event.data.text() };
    }
  }

  const title = data.title || "New Notification";

  const options = {
    body: data.body || "You have a new message",
    vibrate: [200, 100, 200],

    data: {
      url: "/"
    },

    tag: data.tag || "default",
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.openWindow(url)
  );
});
