import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getRoomData,
    joinRoom,
    createRoom,
    leaveRoom,
    inviteToRoom,
} from "../controllers/room.controller.js";

import {
    createRoomSchema,
    joinRoomSchema,
    inviteRoomSchema,
} from "../schemas/room.schema.js";

import { validate } from "../middlewares/validateWithZod.middleware.js";

const router = express.Router();

router.route("/").get(verifyJWT, getRoomData);

router
    .route("/create")
    .post(verifyJWT, validate(createRoomSchema, "body"), createRoom);

router
    .route("/:roomCode/join")
    .post(verifyJWT, validate(joinRoomSchema, "params"), joinRoom);

router.route("/leave").post(verifyJWT, leaveRoom);

router
    .route("/invite")
    .get(verifyJWT, validate(inviteRoomSchema, "query"), inviteToRoom);

export default router;
