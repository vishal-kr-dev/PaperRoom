import axiosInstance from "./axiosInstance";

export async function registerPush() {
    try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("Push notifications not supported");
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn("Notification permission denied");
            return;
        }

        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!publicKey) {
            console.error("Public VAPID key is not set");
            return;
        }

        const existingSubscription = await reg.pushManager.getSubscription();
        if (existingSubscription) {
            console.log("Already subscribed:", existingSubscription);
            return existingSubscription;
        }

        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        const res = await axiosInstance.post("push/subscribe", { subscription });
        console.log("Done ", res)

        return subscription;
    } catch (error) {
        console.error("Error during push registration:", error);
        return;
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
