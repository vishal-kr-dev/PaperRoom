import { Room } from "../../models/Room.model.js";
import { nanoid } from "nanoid";

export const createRoomCode = async () => {
    let code;
    let exists = true;

    while (exists) {
        code = nanoid(6).toUpperCase();
        exists = await Room.exists({ roomCode: code });
    }

    return code;
};
