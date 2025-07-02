import { User } from "../models/User.model.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const access_token = req.cookies?.access_token
    // const refresh_token = req.cookies?.refresh_token

    if (!access_token) {
        throw new APIerror(401, "Unauthorized Access");
    }

    const decodedInfo = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedInfo._id)

    if (!user) {
        throw new APIerror(401, "Invalid Access Token");
    }

    req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        roomId: user.roomId,
        totalXp: user.totalXp,
        level: user.level,
        currentStreak: user.currentStreak,
        streakUpdate: user.streakUpdate,
        emailVerified: user.emailVerified,
    };

    console.log(req.user)

    next();
});
