import { Schema } from "mongoose";

const historySchema = new Schema({
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
	totalPoints: {
		type: Number,
		required: true,
		default: 0,
	},
	taskRecords: [
		{
			taskId: {
				type: Schema.Types.ObjectId,
				ref: "Task",
				required: true,
			},
			title: {
				type: String,
				required: true,
				trim: true,
			},
		},
	],
	tagsSummary: [
		{
			tag: {
				type: String,
				required: true,
				trim: true,
			},
			count: {
				type: Number,
				required: true,
				default: 0,
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

historySchema.index({ userId: 1 });
historySchema.index({ roomId: 1 });

export const History = mongoose.model("History", historySchema);
