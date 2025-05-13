import { Schema } from "mongoose";

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
    points: {
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
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dailyTask: {
      type: Boolean,
      default: false,
    },
    completedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deadline: {
      type: Date,
      default: null,
      validate: {
        validator: (date) => !date || date > new Date(),
        message: "Deadline must be in the future.",
      },
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ roomId: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });

export const Task = mongoose.model("Task", taskSchema);
