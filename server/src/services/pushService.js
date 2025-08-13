import dotenv from "dotenv";
dotenv.config();

import webpush from "web-push";
import { PushSubscription } from "../models/PushSubscription.model.js";

webpush.setVapidDetails(
    process.env.VAPID_CONTACT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export const sendNotificationToRoom = async (roomId, payload) => {
    try {
        console.log(roomId)
        const subs = await PushSubscription.find({ roomId });
        console.log(subs)

        Promise.allSettled(
            subs.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        sub.subscription,
                        JSON.stringify(payload)
                    );
                } catch (err) {
                    if (err.statusCode === 410) {
                        // Subscription expired, delete it
                        await PushSubscription.deleteOne({ _id: sub._id });
                    }
                }
            })
        );
    } catch (err) {
        console.error("Push send error:", err);
    }
};
