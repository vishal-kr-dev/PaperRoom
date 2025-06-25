import { z } from "zod";

export const createRoomSchema = z.object({
    roomName: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).length(5),
    maxMembers: z.number().min(1).max(10).optional(),
    privacy: z.enum(["public", "private"]).optional(),
});

export const joinRoomSchema = z.object({
    roomCode: z.string().length(6, "RoomCode must be of 6 characters"),
});

export const inviteRoomSchema = z.object({
    roomId: z.string().length(24),
});
