import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getPublicKey,
    testSubscription,
    saveNotificationPreferences,
    getNotificationPreferences,
    checkPushSubscription,
    clearPushSubscription,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/public-key", verifyJWT, getPublicKey);
router.post("/test", verifyJWT, testSubscription);
router.put("/save-subscription", verifyJWT, saveNotificationPreferences);


router.get("/preferences", verifyJWT, getNotificationPreferences);
router.delete("/clear-push-subscription", verifyJWT, clearPushSubscription);


router.post("/check-subscription", verifyJWT, checkPushSubscription);

export default router;
