import mongoose, { Schema } from "mongoose";

const dailyStatsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
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
    {
        timestamps: true,
    }
);



export const DailyStats = mongoose.model("DailyStats", dailyStatsSchema);
