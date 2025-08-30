import { AlertTriangle, Bell, Check, Save } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { registerPush } from "@/lib/registerPush";
import { toast } from "sonner";

interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    pushSubscription?: PushSubscription | null;
}

interface BackendNotificationData {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    pushSubscription?: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    } | null;
    // New fields from the unified API
    hasActiveSubscription: boolean;
    subscribedAt?: string;
    isCurrentDevice: boolean;
}

interface SubscriptionObject {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    pushSubscription?: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    } | null;
    // Include current device endpoint for backend comparison
    currentDeviceEndpoint?: string | null;
}

type PermissionState = "default" | "granted" | "denied";

export const NotificationSettings: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: false,
        pushNotifications: false,
        smsNotifications: false,
        marketingEmails: false,
        pushSubscription: null,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSupported, setIsSupported] = useState<boolean>(true);
    const [permissionState, setPermissionState] =
        useState<PermissionState>("default");
    const [error, setError] = useState<string | null>(null);
    const [isPreparingEndpoints, setIsPreparingEndpoints] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Simplified state based on backend response
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [subscribedAt, setSubscribedAt] = useState<string | null>(null);
    const [isCurrentDevice, setIsCurrentDevice] = useState(false);

    // Single effect to fetch all notification data
    useEffect(() => {
        async function initializeNotifications(): Promise<void> {
            console.log("🔔 Initializing notifications...");

            try {
                // Check browser support first
                if (
                    !("serviceWorker" in navigator) ||
                    !("PushManager" in window)
                ) {
                    console.warn(
                        "❌ Browser does not support serviceWorker or PushManager"
                    );
                    setIsSupported(false);
                    setInitialLoading(false);
                    return;
                }

                const permission = Notification.permission as PermissionState;
                console.log("📌 Notification permission:", permission);
                setPermissionState(permission);

                // Get current device subscription if exists
                const reg = await navigator.serviceWorker.getRegistration();
                console.log("🧾 Service Worker Registration:", reg);

                const currentSubscription =
                    await reg?.pushManager.getSubscription();
                console.log(
                    "🔗 Current Push Subscription:",
                    currentSubscription
                );

                // Prepare data for backend call
                const currentDeviceEndpoint =
                    currentSubscription?.endpoint || null;
                console.log(
                    "🌐 Current Device Endpoint:",
                    currentDeviceEndpoint
                );

                // Single API call with current device info
                const response = await axiosInstance.post<{
                    data: BackendNotificationData;
                }>("/notification/check-subscription", {
                    currentDeviceEndpoint,
                });

                const data = response.data.data;
                console.log("📦 Notification data from backend:", data);

                // Update all state from single response
                setNotifications({
                    emailNotifications: data.emailNotifications,
                    smsNotifications: data.smsNotifications,
                    marketingEmails: data.marketingEmails,
                    pushNotifications: data.pushNotifications,
                    pushSubscription: currentSubscription,
                });

                setHasActiveSubscription(data.hasActiveSubscription);
                setSubscribedAt(data.subscribedAt || null);
                setIsCurrentDevice(data.isCurrentDevice);

                // Handle subscription cleanup based on backend response
                if (currentSubscription && !data.isCurrentDevice) {
                    console.warn(
                        "🧹 Unsubscribing from mismatched subscription..."
                    );
                    await currentSubscription.unsubscribe();
                    setNotifications((prev) => ({
                        ...prev,
                        pushSubscription: null,
                    }));
                }

                console.log("✅ Notification initialization complete.");
            } catch (error) {
                console.error("❌ Failed to initialize notifications:", error);
                setError("Failed to load notification settings");
            } finally {
                console.log("🕔 Initialization process ended (finally block).");
                setInitialLoading(false);
            }
        }

        initializeNotifications();
    }, []);

    async function togglePushNotifications(): Promise<void> {
        if (!isSupported) {
            setError("Push notifications are not supported in this browser");
            return;
        }

        if (permissionState === "denied") {
            setError(
                "Push notifications are blocked. Please enable them in your browser settings."
            );
            return;
        }

        try {
            setIsPreparingEndpoints(true);

            if (!notifications.pushNotifications) {
                // Turning ON - request permission and create subscription
                let permission = Notification.permission as PermissionState;
                if (permission === "default") {
                    const requestedPermission =
                        await Notification.requestPermission();
                    permission = requestedPermission as PermissionState;
                    setPermissionState(permission);
                }

                if (permission !== "granted") {
                    setError("Permission not granted for push notifications.");
                    return;
                }

                const subscription = await registerPush();
                if (subscription) {
                    setNotifications((prev) => ({
                        ...prev,
                        pushNotifications: true,
                        pushSubscription: subscription,
                    }));
                    setIsCurrentDevice(true);
                    setError(null);
                }
            } else {
                // Turning OFF - unsubscribe locally
                const reg = await navigator.serviceWorker.ready;
                const subscription = await reg.pushManager.getSubscription();
                if (subscription) {
                    await subscription.unsubscribe();
                }
                setNotifications((prev) => ({
                    ...prev,
                    pushNotifications: false,
                    pushSubscription: null,
                }));
                setIsCurrentDevice(false);
                setError(null);
            }
        } catch (err) {
            console.error("Toggle push error:", err);
            setError("Failed to update push notifications");
        } finally {
            setIsPreparingEndpoints(false);
        }
    }

    async function sendTestNotification(): Promise<void> {
        if (!notifications.pushNotifications || !isCurrentDevice) {
            setError("Please enable push notifications first");
            return;
        }

        try {
            await axiosInstance.post("/notification/test");
            setError(null);
            toast.success("Test notification sent!");
        } catch {
            setError("Failed to send test notification");
        }
    }

    async function clearOtherDeviceSubscription(): Promise<void> {
        try {
            await axiosInstance.delete("/notification/clear-push-subscription");
            setNotifications((prev) => ({
                ...prev,
                pushNotifications: false,
                pushSubscription: null,
            }));
            setHasActiveSubscription(false);
            setIsCurrentDevice(false);
            setSubscribedAt(null);
            toast.success("Previous device subscription cleared");
        } catch {
            setError("Failed to clear previous subscription");
        }
    }

    function createSubscriptionObject(): SubscriptionObject {
        // const reg = navigator.serviceWorker.getRegistration();
        const currentSubscription = notifications.pushSubscription;

        const subscriptionObject: SubscriptionObject = {
            emailNotifications: notifications.emailNotifications,
            smsNotifications: notifications.smsNotifications,
            marketingEmails: notifications.marketingEmails,
            pushNotifications: notifications.pushNotifications,
            currentDeviceEndpoint: currentSubscription?.endpoint || null,
        };

        if (notifications.pushNotifications && currentSubscription) {
            try {
                const p256dhKey = currentSubscription.getKey("p256dh");
                const authKey = currentSubscription.getKey("auth");

                if (p256dhKey && authKey) {
                    subscriptionObject.pushSubscription = {
                        endpoint: currentSubscription.endpoint,
                        keys: {
                            p256dh: btoa(
                                String.fromCharCode(
                                    ...new Uint8Array(p256dhKey)
                                )
                            ),
                            auth: btoa(
                                String.fromCharCode(...new Uint8Array(authKey))
                            ),
                        },
                    };
                }
            } catch {
                subscriptionObject.pushSubscription = null;
            }
        } else {
            subscriptionObject.pushSubscription = null;
        }

        return subscriptionObject;
    }

    function getPushStatusMessage(): string {
        if (!isSupported) {
            return "Push notifications are not supported in this browser";
        }

        if (permissionState === "denied") {
            return "Push notifications are blocked. Please enable them in your browser settings.";
        }

        // Device mismatch scenario
        if (hasActiveSubscription && !isCurrentDevice) {
            return "Push notifications enabled on another device";
        }

        if (
            notifications.pushNotifications &&
            isCurrentDevice &&
            subscribedAt
        ) {
            const subscriptionDate = new Date(
                subscribedAt
            ).toLocaleDateString();
            return `Enabled since ${subscriptionDate}`;
        }

        if (notifications.pushNotifications && isCurrentDevice) {
            return "Push notifications are enabled";
        }

        return "Push notifications are disabled";
    }

    const handleNotificationUpdate = (field: keyof NotificationSettings) => {
        if (field === "pushNotifications") {
            togglePushNotifications();
            return;
        }
        setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSaveNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const subscriptionData = createSubscriptionObject();
            console.log("Saving notifications:", subscriptionData);

            const response = await axiosInstance.put(
                "/notification/save-subscription",
                subscriptionData
            );

            if (response.status === 200) {
                toast.success("Notification preferences saved");
                // Update backend state after successful save
                if (
                    subscriptionData.pushNotifications &&
                    subscriptionData.pushSubscription
                ) {
                    setHasActiveSubscription(true);
                    setIsCurrentDevice(true);
                    setSubscribedAt(new Date().toISOString());
                }
            }
        } catch {
            setError("Failed to save notification settings. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-600 dark:text-gray-400">
                    Loading notification preferences...
                </div>
            </div>
        );
    }

    const deviceMismatch = hasActiveSubscription && !isCurrentDevice;

    return (
        <div>
            <div className="flex items-center mb-6">
                <Bell className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                </h2>
            </div>

            <div className="space-y-6 mb-6">
                {isSupported && (
                    <div
                        className={`p-4 rounded-lg border ${
                            permissionState === "denied"
                                ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
                                : deviceMismatch
                                ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300"
                                : permissionState === "granted" &&
                                  isCurrentDevice
                                ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                                : "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300"
                        }`}
                    >
                        <div className="flex items-start">
                            {permissionState === "denied" ? (
                                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            ) : deviceMismatch ? (
                                <Bell className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            ) : permissionState === "granted" &&
                              isCurrentDevice ? (
                                <Check className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            ) : (
                                <Bell className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h4 className="font-medium mb-1">
                                    {permissionState === "denied" &&
                                        "Browser Notifications Blocked"}
                                    {deviceMismatch &&
                                        "Different Device Detected"}
                                    {permissionState === "granted" &&
                                        isCurrentDevice &&
                                        !deviceMismatch &&
                                        "Browser Notifications Enabled"}
                                    {permissionState === "default" &&
                                        !deviceMismatch &&
                                        "Browser Notification Permission"}
                                </h4>
                                <p className="text-sm">
                                    {getPushStatusMessage()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isSupported && (
                    <div className="p-4 rounded-lg border bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium mb-1">
                                    Browser Not Supported
                                </h4>
                                <p className="text-sm">
                                    Your browser doesn&apos;t support push
                                    notifications. Please use a modern browser
                                    like Chrome, Firefox, or Safari.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
                        role="alert"
                    >
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium mb-1">Error</h4>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            Email Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive important updates via email
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            handleNotificationUpdate("emailNotifications")
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.emailNotifications
                                ? "bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.emailNotifications
                                    ? "translate-x-6"
                                    : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            SMS Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive urgent notifications via text message
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            handleNotificationUpdate("smsNotifications")
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.smsNotifications
                                ? "bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.smsNotifications
                                    ? "translate-x-6"
                                    : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Push Notifications
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {getPushStatusMessage()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {deviceMismatch && (
                            <button
                                onClick={clearOtherDeviceSubscription}
                                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                            >
                                Clear Other Device
                            </button>
                        )}
                        {notifications.pushNotifications &&
                            isSupported &&
                            isCurrentDevice && (
                                <button
                                    onClick={sendTestNotification}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    disabled={
                                        isLoading ||
                                        !notifications.pushSubscription
                                    }
                                >
                                    Test
                                </button>
                            )}
                        <button
                            onClick={() =>
                                handleNotificationUpdate("pushNotifications")
                            }
                            disabled={!isSupported || deviceMismatch}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                notifications.pushNotifications &&
                                permissionState === "granted" &&
                                isCurrentDevice
                                    ? "bg-blue-600"
                                    : isLoading ||
                                      !isSupported ||
                                      deviceMismatch
                                    ? "bg-gray-300 opacity-50 cursor-not-allowed dark:bg-gray-700"
                                    : "bg-gray-200 dark:bg-gray-600"
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    notifications.pushNotifications &&
                                    permissionState === "granted" &&
                                    isCurrentDevice
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            Marketing Emails
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive promotional emails and updates
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            handleNotificationUpdate("marketingEmails")
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.marketingEmails
                                ? "bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.marketingEmails
                                    ? "translate-x-6"
                                    : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            <button
                onClick={handleSaveNotifications}
                disabled={isLoading || isPreparingEndpoints}
                className="inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Preferences"}
            </button>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Debug Info:</h4>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(
                            {
                                ...createSubscriptionObject(),
                                hasActiveSubscription,
                                isCurrentDevice,
                                subscribedAt,
                            },
                            null,
                            2
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
};
