import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/Room.model.js";
import { InviteToken } from "../models/InviteToken.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import crypto from "crypto";
import { createRoomCode } from "../helper/CreateRoomCode.js";
import { APIerror } from "../utils/APIerror.js";

const getRoomData = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const room = await Room.findOne({ members: userId }).populate(
        "members",
        "username email avatar"
    );

    if (!room) {
        throw new APIerror(404, "Room not found");
    }

    return sendResponse(res, 200, room, "Room data retrieved successfully");
});

const createRoom = asyncHandler(async (req, res) => {
    const { roomName, description, maxMembers, tags, privacy } = req.body;
    const userId = req.user.id;

    if (req.user?.roomId) {
        throw new APIerror(400, "User already belongs to a room");
    }

    const roomCode = await createRoomCode();

    const newRoom = new Room({
        roomName,
        roomCode,
        description,
        ownerId: userId,
        members: [userId],
        maxMembers,
        tags,
        privacy,
    });

    await newRoom.save();

    req.user.roomId = newRoom._id;

    await req.user.save();

    return sendResponse(res, 201, newRoom, "Room created successfully");
});

const joinRoom = asyncHandler(async (req, res) => {
    const { roomCode } = req.params;
    const token = req.query.token || "";
    const userId = req.user.id;

    if (req.user?.roomId) {
        throw new APIerror(400, "User already belongs to a room");
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
        throw new APIerror(404, "No room found");
    }

    if (room.members.includes(userId)) {
        return sendResponse(res, 200, { roomCode }, "Already in the room");
    }

    if (room.members.length >= room.maxMembers) {
        throw new APIerror(403, "Room is full");
    }

    if (room.privacy === "private") {
        if (!token) {
            throw new APIerror(
                403,
                "This room is private and requires an invite token"
            );
        }

        const validToken = await InviteToken.findOne({
            token,
            roomId: room._id,
            used: false,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } },
            ],
        });

        if (!validToken) {
            throw new APIerror(403, "Invalid or expired invite token");
        }

        validToken.used = true;
        await validToken.save();
    }

    if (room.privacy === "public" && token) {
        throw new APIerror(
            400,
            "This room is public. Token should not be provided."
        );
    }

    room.members.push(userId);
    await room.save();

    req.user.roomId = room._id;
    await req.user.save();

    return sendResponse(res, 200, { roomCode }, "Joined room successfully");
});


const leaveRoom = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const roomId = req.user?.roomId;

    if (!roomId) {
        throw new APIerror(404, "User have not joined any room");
    }

    const room = await Room.findById({ _id: roomId });
    if (!room) {
        throw new APIerror(404, "Room not found");
    }

    if (!room.members.includes(userId)) {
        throw new APIerror(400, "User is not in this room");
    }

    room.members = room.members.filter(
        (id) => id.toString() !== userId.toString()
    );
    console.log(userId);
    console.log(room.members);
    await room.save();

    req.user.roomId = null;
    await req.user.save();

    return sendResponse(res, 200, null, "Left the room successfully");
});

const inviteToRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.query;
    const userId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) {
        throw new APIerror(404, "Room not found");
    }

    if (!room.ownerId.equals(userId)) {
        throw new APIerror(403, "Only the room owner can invite");
    }

    const token = crypto.randomBytes(16).toString("hex");

    const newToken = new InviteToken({
        token,
        roomId,
        createdBy: userId,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 86400000),
    });

    await newToken.save();

    return sendResponse(
        res,
        200,
        { token },
        "Invite token generated successfully"
    );
});

export { getRoomData, createRoom, joinRoom, leaveRoom, inviteToRoom };
