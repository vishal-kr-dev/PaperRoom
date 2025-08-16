const CACHE_NAME = "push-notifications-v1";

// Install event - cache essential resources
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache
                .addAll(["/", "/icon-192x192.png", "/badge-72x72.png"])
                .catch((err) => {
                    console.warn("Some resources could not be cached:", err);
                });
        })
    );

    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log("Deleting old cache:", cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim(),
        ])
    );
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
    console.log("Push event received:", event);

    let notificationData = {
        title: "New Notification",
        body: "You have received a new notification",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        data: {},
    };

    // Parse the push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = {
                ...notificationData,
                ...pushData,
            };
        } catch (error) {
            console.error("Error parsing push data:", error);
            notificationData.body = event.data.text() || notificationData.body;
        }
    }

    // Notification options
    const notificationOptions = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        data: notificationData.data,
        requireInteraction: false, // Set to true for important notifications
        silent: false,
        vibrate: [200, 100, 200], // Vibration pattern
        // actions: [
        //     {
        //         action: "open",
        //         title: "Open",
        //         icon: "/icon-192x192.png",
        //     },
        //     {
        //         action: "close",
        //         title: "Close",
        //         icon: "/icon-192x192.png",
        //     },
        // ],
        tag: notificationData.data?.tag || "default", // Group similar notifications
        renotify: true, // Show again even if same tag exists
        timestamp: Date.now(),
    };

    // Show the notification
    event.waitUntil(
        self.registration
            .showNotification(notificationData.title, notificationOptions)
            .then(() => {
                console.log("Notification shown successfully");
            })
            .catch((error) => {
                console.error("Error showing notification:", error);
            })
    );
});

// Notification click event - handle user interaction
self.addEventListener("notificationclick", (event) => {
    console.log("Notification clicked:", event);

    const notification = event.notification;
    const data = notification.data || {};

    // Close the notification
    notification.close();

    // Handle the click action
    event.waitUntil(handleNotificationClick(data));
});

// Handle notification click actions
async function handleNotificationClick(data, action) {
    try {
        // Get all window clients
        const clients = await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        });

        // Determine the URL to open
        let urlToOpen = "/";

        if (data.url) {
            urlToOpen = data.url;
        } else if (data.roomId) {
            urlToOpen = `/room/${data.roomId}`;
        } else if (data.messageId) {
            urlToOpen = `/messages/${data.messageId}`;
        }

        // Check if there's already a window open with our site
        for (const client of clients) {
            const clientUrl = new URL(client.url);
            const targetUrl = new URL(urlToOpen, self.location.origin);

            // If we find a matching client, focus it and navigate if needed
            if (clientUrl.origin === targetUrl.origin) {
                if (clientUrl.pathname !== targetUrl.pathname) {
                    // Navigate to the target URL
                    await client.navigate(targetUrl.href);
                }
                return client.focus();
            }
        }

        // If no suitable client is found, open a new window
        return self.clients.openWindow(
            new URL(urlToOpen, self.location.origin).href
        );
    } catch (error) {
        console.error("Error handling notification click:", error);
        // Fallback: just open the main page
        return self.clients.openWindow("/");
    }
}