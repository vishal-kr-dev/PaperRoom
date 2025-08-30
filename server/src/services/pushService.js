import dotenv from "dotenv";
dotenv.config();

import webpush from "web-push";
import { NotificationSubscription } from "../models/Notifications.model.js";

webpush.setVapidDetails(
    process.env.VAPID_CONTACT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Send notification to a specific user
export const sendNotificationToUser = async (userId, payload) => {
    try {
        const sub = await NotificationSubscription.findOne({ userId });

        if (!sub || !sub.pushNotifications || !sub.pushSubscription) {
            return { sent: 0, total: 0 };
        }

        try {
            await webpush.sendNotification(
                sub.pushSubscription,
                JSON.stringify(payload)
            );
            return { sent: 1, total: 1 };
        } catch (err) {
            console.error(
                `Error sending to subscription ${sub._id}:`,
                err.message
            );
            if (err.statusCode === 410 || err.statusCode === 404) {
                await NotificationSubscription.deleteOne({ _id: sub._id });
                console.log(`Deleted expired subscription ${sub._id}`);
            }
            return { sent: 0, total: 1 };
        }
    } catch (err) {
        console.error("Push send error for user:", err);
        throw err;
    }
};

// Send notification to all users in a room
export const sendNotificationToRoom = async (roomId, payload) => {
    try {
        const subs = await NotificationSubscription.find({
            roomId,
            pushNotifications: true,
        });

        const results = await Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.pushSubscription,
                        JSON.stringify(payload)
                    );
                    return { success: true };
                } catch (err) {
                    console.error(
                        `Error sending to subscription ${sub._id}:`,
                        err.message
                    );
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await NotificationSubscription.deleteOne({
                            _id: sub._id,
                        });
                    }
                    return { success: false };
                }
            })
        );

        const successful = results.filter((r) => r.value?.success).length;
        return { sent: successful, total: subs.length };
    } catch (err) {
        console.error("Push send error for room:", err);
        throw err;
    }
};

// Send notification to all subscriptions (broadcast)
export const sendNotificationToAll = async (payload) => {
    try {
        const subs = await NotificationSubscription.find({
            pushNotifications: true,
        });

        const results = await Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.pushSubscription,
                        JSON.stringify(payload)
                    );
                    return { success: true };
                } catch (err) {
                    console.error(
                        `Error sending to subscription ${sub._id}:`,
                        err.message
                    );
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await NotificationSubscription.deleteOne({
                            _id: sub._id,
                        });
                    }
                    return { success: false };
                }
            })
        );

        const successful = results.filter((r) => r.value?.success).length;
        return { sent: successful, total: subs.length };
    } catch (err) {
        console.error("Push send error for broadcast:", err);
        throw err;
    }
};
