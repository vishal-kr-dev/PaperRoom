import mongoose, { Schema } from "mongoose";
import { createRoomCode } from "../helper/CreateRoomCode.js";

const roomSchema = new Schema({
    roomCode: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        default: () => createRoomCode(),
    },
    roomName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    maxMembers: {
        type: Number,
        default: 2,
        min: 1,
        max: 10,
    },
    tags: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    inviteTokens: [
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            expiresAt: Date,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

roomSchema.index({ ownerId: 1 });

export const Room = mongoose.model("Room", roomSchema);
