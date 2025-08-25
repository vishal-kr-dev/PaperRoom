import mongoose, { Schema } from "mongoose";

const monthlyRankingSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    rankings: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            username: String,
            monthlyXP: Number,
        },
    ],
    isFinalized: {
        type: Boolean,
        default: false,
    },
    lastUpdated: Date,
});

monthlyRankingSchema.index({ year: 1, month: 1, roomId: 1 });

export const MonthlyRankings = mongoose.model(
    "MonthlyRankings",
    monthlyRankingSchema
);
