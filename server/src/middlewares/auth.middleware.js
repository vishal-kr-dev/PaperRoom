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

    const user = await User.findById(decodedInfo._id).select(
        "-__v -createdAt -updatedAt"
    );

    if (!user) {
        throw new APIerror(401, "Invalid Access Token");
    }

    req.user = user;

    next();
});
