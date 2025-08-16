import axiosInstance from "./axiosInstance";

export async function registerPush() {
    try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("Push notifications not supported");
            return null;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn("Notification permission denied");
            return null;
        }

        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!publicKey) {
            console.error("Public VAPID key is not set");
            return null;
        }

        const existingSubscription = await reg.pushManager.getSubscription();
        if (existingSubscription) {
            console.log("Already subscribed:", existingSubscription);
            // Still send to server to ensure it's registered
            try {
                await axiosInstance.post("push/subscribe", {
                    subscription: existingSubscription,
                });
            } catch (error) {
                console.error(
                    "Error updating existing subscription on server:",
                    error
                );
            }
            return existingSubscription;
        }

        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        const res = await axiosInstance.post("push/subscribe", {
            subscription,
        });
        console.log("Subscription registered:", res.data);

        return subscription;
    } catch (error) {
        console.error("Error during push registration:", error);
        return null;
    }
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
