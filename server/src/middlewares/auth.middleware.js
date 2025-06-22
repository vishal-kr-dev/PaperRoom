import { User } from "../models/User.model.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("Tokens: ", token)

    if (!token) {
        throw new APIerror(401, "Unauthorized Access");
    }

    const decodedInfo = jwt.verify(
        token.access_token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedInfo._id).select(
        "-__v -createdAt -updatedAt"
    );
    console.log(user)

    if (!user) {
        throw new APIerror(401, "Invalid Access Token");
    }

    req.user = user;
    req.userId = user._id;
    console.log("User data ", user);

    next();
});
