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
                "updated",
                "earned_badge",
            ],
            required: true,
        },
        taskId: {
            type: Schema.Types.ObjectId,
            ref: "Task",
        },
        taskSnapshot: {
            title: {
                type: String,
            },
            tag: {
                type: String,
            },
            priority: {
                type: String,
                enum: ["low", "medium", "high", "urgent"],
            },
            dailyTask: {
                type: Boolean,
            },
            xp: {
                type: Number,
                default: 0
            },
        },
    },
    {
        timestamps: true,
    }
);

userActivitySchema.index({ userId: 1, roomId: 1 });
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ taskId: 1, action: 1 });

export const UserActivity = model("UserActivity", userActivitySchema);
