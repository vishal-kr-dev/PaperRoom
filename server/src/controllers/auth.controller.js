import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { sendResponse } from "../utils/sendResponse.js";

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

    const user = new User({
        email: emailLower,
        username,
        password,
    });

    await user.save();

    const publicUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    };

    return sendResponse(res, 201, publicUser, "User registered successfully");
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

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
        sameSite: "Strict",
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 1 day
        sameSite: "Strict",
    });

    const publicUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    };

    return sendResponse(res, 200, publicUser, "User logged in successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!userId) {
        throw new APIerror(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new APIerror(404, "User not found");
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return sendResponse(res, 200, {}, "User logged out successfully");
});

const getMe = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    const publicUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
    };

    return sendResponse(res, 200, publicUser, "User data retrieved successfully");
})

export { registerUser, loginUser, logoutUser, getMe };
