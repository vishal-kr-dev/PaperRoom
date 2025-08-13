self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};

    event.waitUntil(
        self.registration.showNotification(data.title || "New Notification", {
            body: data.body,
            data: data.data,
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.notification.data?.url) {
        event.waitUntil(clients.openWindow(event.notification.data.url));
    }
});



// self.addEventListener("notificationclick", (event) => {
//     event.notification.close(); // Close the notification pop-up

//     // Check if the payload has a URL to open
//     const urlToOpen = event.notification.data?.url || "/";

//     event.waitUntil(
//         // Get all active browser windows/tabs
//         clients
//             .matchAll({ type: "window", includeUncontrolled: true })
//             .then((windowClients) => {
//                 // If there's already a tab open with the target URL, focus it
//                 for (const client of windowClients) {
//                     if (client.url.includes(urlToOpen) && "focus" in client) {
//                         return client.focus();
//                     }
//                 }
//                 // Otherwise, open a new tab
//                 if (clients.openWindow) {
//                     return clients.openWindow(urlToOpen);
//                 }
//             })
//     );
// });

