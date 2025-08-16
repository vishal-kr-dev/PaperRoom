"use client";

import axiosInstance from "@/lib/axiosInstance";
import { registerPush } from "@/lib/registerPush";
import { useEffect, useState } from "react";

// Type definitions
interface SubscriptionInfo {
    isSubscribed: boolean;
    subscribedAt?: string;
}

type PermissionState = "default" | "granted" | "denied";

export default function PushToggle(){
    const [enabled, setEnabled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSupported, setIsSupported] = useState<boolean>(true);
    const [permissionState, setPermissionState] =
        useState<PermissionState>("default");
    const [subscriptionInfo, setSubscriptionInfo] =
        useState<SubscriptionInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check push notification support and initial state
    useEffect(() => {
        async function checkPushSupport(): Promise<void> {
            // Check if push notifications are supported
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                setIsSupported(false);
                return;
            }

            try {
                // Check permission state
                const permission = Notification.permission as PermissionState;
                setPermissionState(permission);

                // Check current subscription state
                const reg = await navigator.serviceWorker.ready;
                const subscription = await reg.pushManager.getSubscription();

                if (subscription) {
                    setEnabled(true);
                    // Check with backend if this subscription is still valid
                    await checkBackendSubscription(subscription);
                } else {
                    setEnabled(false);
                }
            } catch (error) {
                console.error("Error checking push support:", error);
                setError("Failed to check push notification support");
            }
        }

        checkPushSupport();
    }, []);

    // Check if subscription exists on backend
    async function checkBackendSubscription(
        subscription: PushSubscription
    ): Promise<void> {
        try {
            const response = await axiosInstance.post<SubscriptionInfo>(
                "push/check-subscription",
                {
                    endpoint: subscription.endpoint,
                }
            );

            setSubscriptionInfo(response.data);

            // If backend doesn't have this subscription, update local state
            if (!response.data.isSubscribed) {
                setEnabled(false);
                // Clean up local subscription
                await subscription.unsubscribe();
            }
        } catch (error) {
            console.error("Error checking backend subscription:", error);
            // Don't set error state here as this is a background check
        }
    }

    async function togglePushNotifications(): Promise<void> {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            if (!isSupported) {
                setError(
                    "Push notifications are not supported in this browser"
                );
                return;
            }

            // Check permission first
            let permission = Notification.permission as PermissionState;
            if (permission === "default") {
                const requestedPermission =
                    await Notification.requestPermission();
                permission = requestedPermission as PermissionState;
                setPermissionState(permission);
            }

            if (permission === "denied") {
                setError(
                    "Push notifications are blocked. Please enable them in your browser settings."
                );
                return;
            }

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
                    setSubscriptionInfo(null);
                }
            } else {
                // Subscribe
                const newSubscription = await registerPush();
                if (newSubscription) {
                    setEnabled(true);
                    // Get updated subscription info from backend
                    await checkBackendSubscription(newSubscription);
                }
            }
        } catch (error) {
            console.error("Error toggling push notifications:", error);
            setError("Failed to toggle push notifications. Please try again.");

            // Revert state if there was an error
            try {
                const reg = await navigator.serviceWorker.ready;
                const subscription = await reg.pushManager.getSubscription();
                setEnabled(!!subscription);
            } catch (revertError) {
                console.error("Error reverting state:", revertError);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function sendTestNotification(): Promise<void> {
        if (!enabled) {
            setError("Please enable push notifications first");
            return;
        }

        try {
            await axiosInstance.post("push/test");
            console.log("Test notification sent");
            setError(null);
        } catch (error) {
            console.error("Error sending test notification:", error);
            setError("Failed to send test notification");
        }
    }

    // Get status message based on current state
    function getStatusMessage(): string {
        if (!isSupported) {
            return "Push notifications are not supported in this browser";
        }

        if (permissionState === "denied") {
            return "Push notifications are blocked. Please enable them in your browser settings.";
        }

        if (enabled && subscriptionInfo?.subscribedAt) {
            const subscriptionDate = new Date(
                subscriptionInfo.subscribedAt
            ).toLocaleDateString();
            return `Enabled since ${subscriptionDate}`;
        }

        if (enabled) {
            return "Push notifications are enabled";
        }

        return "Push notifications are disabled";
    }

    return (
        <div className="space-y-3">
            {/* Main toggle and test button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={togglePushNotifications}
                        disabled={isLoading || !isSupported}
                        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                            enabled ? "bg-green-500" : "bg-gray-400"
                        } ${
                            isLoading || !isSupported
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        aria-label={`Turn push notifications ${
                            enabled ? "off" : "on"
                        }`}
                    >
                        <div
                            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                                enabled ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                    </button>

                    <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-600">
                            {getStatusMessage()}
                        </div>
                    </div>
                </div>

                {enabled && (
                    <button
                        onClick={sendTestNotification}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Test
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div
                    className="text-sm text-red-600 bg-red-50 p-2 rounded"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Browser compatibility note */}
            {!isSupported && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    Your browser doesn&apos;t support push notifications. Please
                    use a modern browser like Chrome, Firefox, or Safari.
                </div>
            )}
        </div>
    );
}
