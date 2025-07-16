import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createNewTask,
    getAllTasks,
    updateTask,
    deleteTask,
    markComplete,
    markIncomplete,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validateWithZod.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

const router = express.Router();

router
    .route("/")
    .get(verifyJWT, getAllTasks)
    .post(validate(createTaskSchema), verifyJWT, createNewTask);

router
    .route("/:id")
    .patch(validate(updateTaskSchema), verifyJWT, updateTask)
    .delete(verifyJWT, deleteTask);

router.patch("/:id/complete", verifyJWT, markComplete);

router.patch("/:id/incomplete", verifyJWT, markIncomplete)

export default router;
