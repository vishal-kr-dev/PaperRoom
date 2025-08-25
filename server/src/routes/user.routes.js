import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChartData, getRanking } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/xp-chart").get(verifyJWT, getChartData);

router.route("/rankings/:year/:month").get(verifyJWT, getRanking)

export default router;
