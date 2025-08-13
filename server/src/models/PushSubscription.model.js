import mongoose from "mongoose";

const PushSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    subscription: { type: Object, required: true }, 
});

export const PushSubscription = mongoose.model(
    "PushSubscription",
    PushSubscriptionSchema
);
