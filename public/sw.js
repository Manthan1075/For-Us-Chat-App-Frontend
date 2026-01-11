self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Notification", body: "New Notification.." };
  }

  const options = {
    body: data.body || "New update",
    vibrate: [200, 100, 200],
    
    data: {
      url: data.url || "/",
      type: data.type || "normal"
    },

    tag: data.tag || "default", 
    renotify: true             
};

  event.waitUntil(
    self.registration.showNotification(data.title || "Alert", options)
  );
});


self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.openWindow(url)
  );
});
