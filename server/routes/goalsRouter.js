import express from 'express'

import verifyUser from '../middleware/verifyUser.js'
import { saveGoals, updateGoals, deleteGoal } from "../controllers/goalsController.js";

const router= express.Router()

router.post("/save", verifyUser, saveGoals)
router.put("/update/:goalId", verifyUser, updateGoals);
router.delete("/delete/:goalId", verifyUser, deleteGoal);
router.put("/update-subtask/:goalId/:subtaskId", verifyUser, );

export default router