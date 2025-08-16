import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPublicKey, subscribe, unsubscribe, testSubscription } from "../controllers/push.controller.js";

const router = express.Router();

router.get("/public-key", verifyJWT, getPublicKey);

router.post("/subscribe", verifyJWT, subscribe);

router.post("/unsubscribe", verifyJWT, unsubscribe)

router.post("/test", verifyJWT, testSubscription)

export default router;
