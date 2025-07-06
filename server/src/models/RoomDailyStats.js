import mongoose, { Schema } from "mongoose";

const roomDailyStatsSchema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        totalXP: {
            type: Number,
            default: 0,
            min: 0,
            required: true,
        },
        totalTasksCompleted: {
            type: Number,
            default: 0,
            min: 0,
            required: true,
        },
        activeUserIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        avgXpPerUser: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const RoomDailyStats = mongoose.model("RoomDailyStats", roomDailyStatsSchema);
