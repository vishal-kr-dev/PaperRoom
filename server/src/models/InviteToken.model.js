import mongoose, { Schema } from "mongoose";

const inviteTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    used: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
inviteTokenSchema.index({ token: 1, roomId: 1, used: 1, expiresAt: 1 });  

export const InviteToken = mongoose.model("InviteToken", inviteTokenSchema);
