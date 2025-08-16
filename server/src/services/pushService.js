import dotenv from "dotenv";
dotenv.config();

import webpush from "web-push";
import { PushSubscription } from "../models/PushSubscription.model.js";

webpush.setVapidDetails(
    process.env.VAPID_CONTACT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Send notification to a specific user
export const sendNotificationToUser = async (userId, payload) => {
    try {
        // console.log(`Sending notification to user: ${userId}`);
        const subs = await PushSubscription.find({ userId });
        // console.log(`Found ${subs.length} subscriptions for user ${userId}`);

        const results = await Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.subscription,
                        JSON.stringify(payload)
                    );
                    return { success: true, subscriptionId: sub._id };
                } catch (err) {
                    console.error(`Error sending to subscription ${sub._id}:`, err.message);
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        // Subscription expired or invalid, delete it
                        await PushSubscription.deleteOne({ _id: sub._id });
                        console.log(`Deleted expired subscription ${sub._id}`);
                    }
                    return { success: false, subscriptionId: sub._id, error: err.message };
                }
            })
        );

        const successful = results.filter(r => r.value?.success).length;
        console.log(`Successfully sent ${successful}/${subs.length} notifications to user ${userId}`);
        
        return { sent: successful, total: subs.length };
    } catch (err) {
        console.error("Push send error for user:", err);
        throw err;
    }
};

// Send notification to all users in a room
export const sendNotificationToRoom = async (roomId, payload) => {
    try {
        // console.log(`Sending notification to room: ${roomId}`);
        const subs = await PushSubscription.find({ roomId });
        // console.log(`Found ${subs.length} subscriptions for room ${roomId}`);

        const results = await Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.subscription,
                        JSON.stringify(payload)
                    );
                    return { success: true, subscriptionId: sub._id };
                } catch (err) {
                    console.error(`Error sending to subscription ${sub._id}:`, err.message);
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        // Subscription expired or invalid, delete it
                        await PushSubscription.deleteOne({ _id: sub._id });
                        // console.log(`Deleted expired subscription ${sub._id}`);
                    }
                    return { success: false, subscriptionId: sub._id, error: err.message };
                }
            })
        );

        const successful = results.filter(r => r.value?.success).length;
        // console.log(`Successfully sent ${successful}/${subs.length} notifications to room ${roomId}`);
        
        return { sent: successful, total: subs.length };
    } catch (err) {
        console.error("Push send error for room:", err);
        throw err;
    }
}

// Send notification to all subscriptions (broadcast)
export const sendNotificationToAll = async (payload) => {
    try {
        // console.log("Sending notification to all users");
        const subs = await PushSubscription.find({});
        // console.log(`Found ${subs.length} total subscriptions`);

        const results = await Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.subscription,
                        JSON.stringify(payload)
                    );
                    return { success: true, subscriptionId: sub._id };
                } catch (err) {
                    console.error(`Error sending to subscription ${sub._id}:`, err.message);
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        // Subscription expired or invalid, delete it
                        await PushSubscription.deleteOne({ _id: sub._id });
                        // console.log(`Deleted expired subscription ${sub._id}`);
                    }
                    return { success: false, subscriptionId: sub._id, error: err.message };
                }
            })
        );

        const successful = results.filter(r => r.value?.success).length;
        // console.log(`Successfully sent ${successful}/${subs.length} notifications to all users`);
        
        return { sent: successful, total: subs.length };
    } catch (err) {
        console.error("Push send error for broadcast:", err);
        throw err;
    }
};
