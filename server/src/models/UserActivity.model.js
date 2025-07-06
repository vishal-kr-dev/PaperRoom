import { Schema, model } from "mongoose";

const userActivitySchema = new Schema(
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
        action: {
            type: String,
            enum: [
                "created",
                "completed",
                "deleted",
                "archived",
                "edited",
                "earned_badge",
            ],
            required: true,
        },
        taskId: {
            type: Schema.Types.ObjectId,
            ref: "Task"
        },
        taskTitle: {
            type: String
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);


userActivitySchema.index({userId: 1, roomId: 1})
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ userId: 1, action: 1 });
userActivitySchema.index({ roomId: 1, createdAt: -1 });
userActivitySchema.index({ taskId: 1 });

userActivitySchema.statics.getTotalPointsEarned = function (userId) {
    return this.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalPoints: { $sum: "$pointsEarned" } } },
    ]);
};


export const UserActivity = model("UserActivity", userActivitySchema);
