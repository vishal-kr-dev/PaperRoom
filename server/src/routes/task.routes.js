import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createNewTask,
    getAllTasks,
    updateTask,
    deleteTask,
    markComplete,
} from "../controllers/task.controller.js";

const router = express.Router();

router
    .route("/")
    .get(verifyJWT, getAllTasks)
    .post(verifyJWT, createNewTask);

router
    .route("/:id")
    .patch(verifyJWT, updateTask)
    .delete(verifyJWT, deleteTask);

router.patch("/:id/complete", verifyJWT, markComplete)

export default router;