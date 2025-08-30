export async function registerPush() {
    try {
        // if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        //     console.warn("Push notifications not supported");
        //     return null;
        // }

        // const permission = await Notification.requestPermission();
        // if (permission !== "granted") {
        //     console.warn("Notification permission denied");
        //     return null;
        // }

        // // Register service worker
        // const reg = await navigator.serviceWorker.register("/sw.js");
        const reg = await navigator.serviceWorker.ready;

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) {
            console.error("Public VAPID key is not set");
            return null;
        }

        const existing = await reg.pushManager.getSubscription();
        if (existing) {
            console.log("Using existing subscription:", existing);
            return existing;
        }

        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        console.log("New subscription created:", subscription);
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
