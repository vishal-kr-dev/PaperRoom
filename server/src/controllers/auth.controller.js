import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { sendResponse } from "../utils/sendResponse.js";
import { Stats } from "../models/Stats.model.js";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new APIerror(400, "All required fields must be provided");
    }

    const emailLower = email.toLowerCase();

    const existingUser = await User.findOne({
        email: emailLower,
    });

    if (existingUser) {
        throw new APIerror(409, "Email is already in use");
    }

    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const user = new User({
                email: emailLower,
                username,
                password,
            });

            await user.save({ session });
            await Stats.create([{ userId: user._id }], { session });

            return {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            };
        });

        return sendResponse(res, 201, result, "User registered successfully");
    } finally {
        await session.endSession();
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new APIerror(400, "All required fields must be provided");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
    );

    if (!user) {
        throw new APIerror(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new APIerror(401, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 3600000,
        sameSite: isProduction ? "None" : "Lax",
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 86400000,
        sameSite: isProduction ? "None" : "Lax",
    });

    const publicUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        roomId: user.roomId,
        emailVerified: user.emailVerified,
    };

    return sendResponse(res, 200, publicUser, "User logged in successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return sendResponse(res, 200, {}, "User logged out");
});

const getMe = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    return sendResponse(res, 200, user, "User data retrieved successfully");
});

export { registerUser, loginUser, logoutUser, getMe };
