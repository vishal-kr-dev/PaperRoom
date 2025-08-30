import { NotificationSubscription } from "../models/Notifications.model.js";
import { sendNotificationToUser } from "../services/pushService.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

const getPublicKey = asyncHandler(async (req, res) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    return sendResponse(
        res,
        200,
        { publicKey },
        "Public key retrieved successfully"
    );
});

const testSubscription = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return sendResponse(res, 404, {}, "User not found");
    }

    const payload = {
        title: "🔔 Test Notification",
        body: "Push notifications are working correctly!",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        data: {
            type: "test",
            timestamp: new Date().toISOString(),
            url: "/settings",
        },
    };

    const result = await sendNotificationToUser(userId, payload);

    if (result.sent === 0) {
        return sendResponse(
            res,
            404,
            {},
            "No active subscriptions found for your account"
        );
    }

    return sendResponse(res, 200, {}, "Test notification sent successfully");
});

const saveNotificationPreferences = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { roomId } = req.user;
    const notifications = req.body;

    if (notifications.pushNotifications && !notifications.pushSubscription) {
        throw new APIerror(
            400,
            "Push subscription required when push notifications enabled"
        );
    }

    const response = await NotificationSubscription.findOneAndUpdate(
        { userId, roomId },
        {
            ...notifications,
            updatedAt: new Date(),
        },
        { new: true, upsert: true }
    );

    if (!response) {
        throw new APIerror(
            500,
            "Something went wrong while saving preferences"
        );
    }

    return sendResponse(
        res,
        200,
        response,
        "Notification preferences saved successfully"
    );
});

const getNotificationPreferences = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { roomId } = req.user;

    const subscription = await NotificationSubscription.findOne({
        userId,
        roomId,
    });

    if (!subscription) {
        const defaultData = {
            emailNotifications: false,
            smsNotifications: false,
            marketingEmails: false,
            pushNotifications: false,
        };
        return sendResponse(
            res,
            200,
            defaultData,
            "Default notification preferences"
        );
    }

    const data = {
        emailNotifications: subscription.emailNotifications,
        smsNotifications: subscription.smsNotifications,
        marketingEmails: subscription.marketingEmails,
        pushNotifications: subscription.pushNotifications,
        ...(subscription.pushSubscription
            ? { pushSubscription: subscription.pushSubscription }
            : {}),
    };

    return sendResponse(
        res,
        200,
        data,
        "Notification preferences retrieved successfully"
    );
});

const checkPushSubscription = asyncHandler(async (req, res) => {
    const { currentDeviceEndpoint = null } = req.body;
    const userId = req.user._id;
    const { roomId } = req.user;
    console.log("endpoint", currentDeviceEndpoint);

    const subscription = await NotificationSubscription.findOne({
        userId,
        roomId,
    });
    console.log("found", subscription);

    // Base response data with default values
    const data = {
        emailNotifications: subscription?.emailNotifications || false,
        smsNotifications: subscription?.smsNotifications || false,
        marketingEmails: subscription?.marketingEmails || false,
        pushNotifications: subscription?.pushNotifications || false,
        hasActiveSubscription: false,
        subscribedAt: null,
        isCurrentDevice: false,
        pushSubscription: null, // Include the actual subscription data if needed by frontend
    };

    // Handle push notification specific logic
    if (subscription?.pushNotifications && subscription?.pushSubscription) {
        data.hasActiveSubscription = true;
        data.subscribedAt = subscription.createdAt || subscription.updatedAt; // Use actual timestamp
        data.isCurrentDevice =
            currentDeviceEndpoint === subscription.pushSubscription.endpoint;

        // Optionally include the push subscription data (you might need this for frontend)
        data.pushSubscription = subscription.pushSubscription;
    }

    console.log("Response data:", data);

    return sendResponse(
        res,
        200,
        data,
        "Subscription data retrieved successfully"
    );
});

// Alternative version if you want to be more explicit about different scenarios:
// const checkPushSubscriptionDetailed = asyncHandler(async (req, res) => {
//     const { currentDeviceEndpoint = null } = req.body;
//     const userId = req.user._id;
//     const { roomId } = req.user;

//     console.log("Checking subscription for user:", userId);
//     console.log("Current device endpoint:", currentDeviceEndpoint);

//     const subscription = await NotificationSubscription.findOne({
//         userId,
//         roomId,
//     });

//     // Base preferences (always return these)
//     const data = {
//         emailNotifications: subscription?.emailNotifications || false,
//         smsNotifications: subscription?.smsNotifications || false,
//         marketingEmails: subscription?.marketingEmails || false,
//         pushNotifications: subscription?.pushNotifications || false,
//         hasActiveSubscription: false,
//         subscribedAt: null,
//         isCurrentDevice: false,
//         pushSubscription: null,
//     };

//     // Check if user has push notifications enabled
//     if (!subscription?.pushNotifications) {
//         console.log("Push notifications disabled for user");
//         return sendResponse(res, 200, data, "Push notifications disabled");
//     }

//     // Check if there's an actual push subscription stored
//     if (!subscription?.pushSubscription?.endpoint) {
//         console.log("No push subscription found in database");
//         // User has push enabled but no subscription - this is an inconsistent state
//         data.pushNotifications = false; // Fix the inconsistency
//         return sendResponse(
//             res,
//             200,
//             data,
//             "No active push subscription found"
//         );
//     }

//     // We have an active push subscription
//     data.hasActiveSubscription = true;
//     data.subscribedAt = subscription.createdAt || subscription.updatedAt;
//     data.pushSubscription = subscription.pushSubscription;

//     // Check if current device matches stored subscription
//     if (currentDeviceEndpoint) {
//         data.isCurrentDevice =
//             currentDeviceEndpoint === subscription.pushSubscription.endpoint;
//         console.log("Device match:", data.isCurrentDevice);
//     } else {
//         console.log("No current device endpoint provided");
//         data.isCurrentDevice = false;
//     }

//     console.log("Final response data:", data);

//     return sendResponse(
//         res,
//         200,
//         data,
//         "Subscription data retrieved successfully"
//     );
// });

const clearPushSubscription = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { roomId } = req.user;

    const response = await NotificationSubscription.findOneAndUpdate(
        { userId, roomId },
        {
            pushNotifications: false,
            $unset: { pushSubscription: 1 },
            updatedAt: new Date(),
        },
        { new: true }
    );

    if (!response) {
        return sendResponse(res, 404, {}, "No subscription found to clear");
    }

    return sendResponse(res, 200, {}, "Push subscription cleared successfully");
});

export {
    getPublicKey,
    testSubscription,
    saveNotificationPreferences,
    getNotificationPreferences,
    checkPushSubscription,
    clearPushSubscription,
};
