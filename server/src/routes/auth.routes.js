import express from "express";
import { validate } from "../middlewares/validateWithZod.middleware.js";
import {
    loginUser,
    logoutUser,
    registerUser,
    getMe,
} from "../controllers/auth.controller.js";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
    .route("/signup")
    .post(validate(registerUserSchema, "body"), registerUser);

router.route("/login").post(validate(loginUserSchema, "body"), loginUser);

router.route("/logout").post(logoutUser);

// router.post("/forgot-password", );
// router.post("/reset-password", );

router.route("/me").get(verifyJWT, getMe);

export default router;
