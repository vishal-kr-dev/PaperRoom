import { Schema } from "mongoose";

const roomSchema = new Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    default: function () {
      return createRoomCode(this.roomName);
    },
  },
  roomName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tags: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const createRoomCode = (roomName) => {
  return (
    roomName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
};

roomSchema.pre("save", function (next) {
  if (this.isModified("roomName") || this.isNew) {
    this.roomCode = createRoomCode(this.roomName);
  }
  next();
});

roomSchema.index({ ownerId: 1 });

export const Room = mongoose.model("Room", roomSchema);
