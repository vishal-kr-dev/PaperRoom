import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChartData } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/xp-chart").get(verifyJWT, getChartData);

export default router;
