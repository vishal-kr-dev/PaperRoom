import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	permissions: {
		type: [String],
		enum: ["all"],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

adminSchema.index({ userId: 1 });

const Admin = mongoose.model("Admin", adminSchema);
