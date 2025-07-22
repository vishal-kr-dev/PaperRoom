import express from "express";
import { getUserActivities, getUserActivityStats } from "../controllers/userActivity.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getUserActivities);

router.get("/stats", verifyJWT, getUserActivityStats);

export default router;
