import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        xp: {
            type: Number,
            required: true,
            default: 0,
        },
        subtasks: [
            {
                type: String,
                trim: true,
            },
        ],
        tag: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        dailyTask: {
            type: Boolean,
            default: false,
        },
        deadline: {
            type: Date,
            default: null,
            validate: {
                validator: (date) => !date || date > new Date(),
                message: "Deadline must be in the future.",
            },
        },
        completedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ roomId: 1, isDeleted: 1 });
// Auto-delete the document 7 days after `deletedAt` is set
taskSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export const Task = mongoose.model("Task", taskSchema);
