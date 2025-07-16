import mongoose, { Schema } from "mongoose";

const dailyStatsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
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
        xp: {
            type: Number,
            default: 0,
            min: 0,
            required: true,
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            min: 0,
            required: true,
        },
    },
);

dailyStatsSchema.index({ userId: 1, date: 1 });

export const DailyStats = mongoose.model("DailyStats", dailyStatsSchema);
