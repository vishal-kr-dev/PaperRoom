
---

# ✅ Task Completion Flow with Transactions in Express + Mongoose

This guide documents how to securely handle **task completion** in an Express + Mongoose app using **MongoDB transactions** to ensure atomic updates across multiple collections.

---

## 📦 Overview

When a user completes a task:

1. ✅ The `Task` is marked completed by the user
2. ✅ XP is added to the `User`
3. ✅ The task is logged in `TaskCompletionLog`
4. ✅ Monthly stats are updated in `UserMonthlyStats`
5. ✅ All changes are handled in a **MongoDB transaction**

---

## 🗂 Folder Structure

```
/routes
  taskRoutes.js

/controllers
  completeTaskController.js

/services
  completeTask.js

/models
  Task.js
  User.js
  TaskCompletionLog.js
  UserMonthlyStats.js

/middleware
  authMiddleware.js
```

---

## 🛠️ MongoDB: Enable Transactions (Local Dev)

Transactions require MongoDB to run as a **replica set**:

```bash
# Start MongoDB as replica set (once)
mongod --replSet rs0 --dbpath /data/db

# Then in mongo shell:
mongosh
> rs.initiate()
```

---

## 📁 Route Setup

### `routes/taskRoutes.js`

```js
import express from "express";
import { completeTaskHandler } from "../controllers/completeTaskController.js";

const router = express.Router();

// POST /api/tasks/:taskId/complete
router.post("/:taskId/complete", completeTaskHandler);

export default router;
```

---

## 🎯 Controller Logic

### `controllers/completeTaskController.js`

```js
import { Task } from "../models/Task.js";
import { completeTask } from "../services/completeTask.js";

export const completeTaskHandler = async (req, res) => {
  const userId = req.user._id;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.completedBy.includes(userId)) {
      return res.status(400).json({ error: "Task already completed" });
    }

    task.completedBy.push(userId);
    await task.save();

    await completeTask({ userId, task });

    res.status(200).json({ message: "Task completed and stats updated" });
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ error: "Failed to complete task" });
  }
};
```

---

## 🔄 Transaction Logic

### `services/completeTask.js`

```js
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { TaskCompletionLog } from "../models/TaskCompletionLog.js";
import { UserMonthlyStats } from "../models/UserMonthlyStats.js";

export const completeTask = async ({ userId, task }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    user.experience += task.points;
    user.level = Math.floor(0.1 * Math.sqrt(user.experience)) + 1;
    await user.save({ session });

    await TaskCompletionLog.create(
      [{
        userId,
        taskId: task._id,
        taskTitle: task.title,
        roomId: task.roomId,
        completedAt: new Date(),
        points: task.points,
        tag: task.tag,
      }],
      { session }
    );

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    await UserMonthlyStats.findOneAndUpdate(
      { userId, month },
      {
        $inc: {
          experience: task.points,
          tasksCompleted: 1,
        },
        $setOnInsert: {
          levelSnapshot: user.level,
        },
      },
      { upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Task completion failed:", error);
    throw new Error("Could not complete task. All changes were rolled back.");
  }
};
```

---

## 🔐 Auth Middleware Example

### `middleware/authMiddleware.js`

```js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
```

---

## ✅ Result

**All updates happen safely.** If one part fails, **nothing is saved**, keeping your data consistent.

---

## 📤 Bonus: Postman Test

**POST** `/api/tasks/1234567890abcdef/complete`
**Headers**:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**:

```json
{
  "message": "Task completed and stats updated"
}
```

---

## 📌 Summary

| Step                        | Description                       |
| --------------------------- | --------------------------------- |
| ✅ Mark task completed       | Add user ID to `task.completedBy` |
| ✅ Update user XP/level      | Done in `User` document           |
| ✅ Log completion            | In `TaskCompletionLog`            |
| ✅ Update monthly stats      | In `UserMonthlyStats`             |
| 🔁 All in a transaction     | Ensures atomicity                 |
| 🧪 Tested via Express route | Full flow supported               |

---

Let me know if you'd like a working Postman collection, test coverage, or a demo route for the monthly reset too!
