import { Schema, model } from "mongoose";

const monthlyStatsSchema = new Schema(
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
        month: {
            type: String,
            required: true,
        },
        xp: {
            type: Number,
            default: 0,
            required: true,
        },
        levelSnapshot: {
            type: Number,
            default: 1,
            required: true,
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

monthlyStatsSchema.index({ userId: 1, month: 1 }, { unique: true });

export const MonthlyStats = model(
    "MonthlyStats",
    monthlyStatsSchema
);
