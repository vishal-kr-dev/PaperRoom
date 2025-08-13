import axiosInstance from "@/lib/axiosInstance";
import { registerPush } from "@/lib/registerPush";
import { useEffect, useState } from "react";

export default function PushToggle() {
    const [enabled, setEnabled] = useState(false);

    // Check initial subscription state on mount
    useEffect(() => {
        async function checkSubscription() {
            if (!("serviceWorker" in navigator)) return;
            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.getSubscription();
            setEnabled(!!subscription);
        }
        checkSubscription();
    }, []);

    async function togglePushNotifications() {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();

        if (subscription) {
            // Unsubscribe
            const unsubscribed = await subscription.unsubscribe();
            if (unsubscribed) {
                await axiosInstance.post("push/unsubscribe", {
                    endpoint: subscription.endpoint,
                });
                setEnabled(false);
            }
        } else {
            // Subscribe
            await registerPush();
            setEnabled(true);
        }
    }

    return (
        <div
            onClick={togglePushNotifications}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                enabled ? "bg-green-500" : "bg-gray-400"
            }`}
        >
            <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    enabled ? "translate-x-6" : "translate-x-0"
                }`}
            />
        </div>
    );
}
