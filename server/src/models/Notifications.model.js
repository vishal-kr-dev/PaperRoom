import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        emailNotifications: {
            type: Boolean,
            default: false,
        },
        smsNotifications: {
            type: Boolean,
            default: false,
        },
        marketingEmails: {
            type: Boolean,
            default: false,
        },
        pushNotifications: {
            type: Boolean,
            default: false,
        },
        pushSubscription: {
            endpoint: String,
            keys: {
                p256dh: String,
                auth: String,
            }
        },
    },
    {
        timestamps: true,
    }
);

NotificationsSchema.pre("save", function (next) {
    if (this.pushNotifications) {
        if (
            !this.pushSubscription?.endpoint ||
            !this.pushSubscription?.keys?.p256dh ||
            !this.pushSubscription?.keys?.auth
        ) {
            return next(
                new Error(
                    "Push subscription data required when push notifications are enabled"
                )
            );
        }
    }
    next();
});

export const NotificationSubscription = mongoose.model(
    "NotificationsSubscription",
    NotificationsSchema
);
