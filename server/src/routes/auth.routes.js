import express from "express";
import { validate } from "../middlewares/validateWithZod.middleware.js";
import {
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/auth.controller.js";
import { loginUserSchema, registerUserSchema } from "../validators/user.validator.js";

const router = express.Router();

router.route("/register").post(validate(registerUserSchema), registerUser);
router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/logout").post(logoutUser);
// router.post("/forgot-password", );
// router.post("/reset-password", );

export default router;
