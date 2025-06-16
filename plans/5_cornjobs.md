Sure! Here's your documentation formatted as a `.md` file, ready to copy into a `docs/MonthlyGamificationSetup.md` or similar:

---

# 📘 Monthly Gamification System Setup

This guide explains how to set up a scalable monthly gamification system using:

* `UserMonthlyStats` for monthly XP and level tracking
* `TaskCompletionLog` for detailed user task completion history
* Optional refactoring of `History` into `UserActivityLog`
* Cron-based monthly reset
* Data migration script

---

## 📁 Models Overview

### ✅ `UserMonthlyStats`

Tracks monthly experience and level snapshot.

```js
{
  userId: ObjectId,
  month: "2025-06",
  experience: Number,
  levelSnapshot: Number,
  tasksCompleted: Number
}
```

---

### ✅ `TaskCompletionLog`

Logs every task completed by a user.

```js
{
  userId: ObjectId,
  taskId: ObjectId, // optional
  taskTitle: String,
  completedAt: Date,
  roomId: ObjectId,
  points: Number,
  tag: String
}
```

> Use `taskTitle`, `tag`, and `points` directly to preserve history even if the task is deleted.

---

### ✅ `UserActivityLog` (formerly `History`)

High-level summary of user activities per room.

```js
{
  userId: ObjectId,
  roomId: ObjectId,
  totalPoints: Number,
  taskRecords: [
    {
      taskTitle: String,
      tag: String,
      points: Number,
      completedAt: Date
    }
  ],
  tagsSummary: [
    { tag: String, count: Number }
  ]
}
```

---

## 🔁 Monthly Stats Reset Job

Creates or updates `UserMonthlyStats` documents at the start of each month.

### `resetMonthlyStats.js`

```js
export const resetMonthlyStats = async () => {
  const users = await User.find({});
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  for (const user of users) {
    await UserMonthlyStats.findOneAndUpdate(
      { userId: user._id, month: currentMonth },
      {
        $setOnInsert: {
          experience: user.experience,
          levelSnapshot: user.level,
          tasksCompleted: 0,
        },
      },
      { upsert: true, new: true }
    );
  }

  console.log(`Monthly stats snapshot created for ${users.length} users`);
};
```

---

## ✅ Logging Task Completion

### `completeTask.js`

Updates XP, logs task, and updates `UserMonthlyStats`.

```js
export const completeTask = async ({ userId, task }) => {
  const user = await User.findById(userId);
  user.experience += task.points;
  user.level = Math.floor(0.1 * Math.sqrt(user.experience)) + 1;
  await user.save();

  await TaskCompletionLog.create({
    userId: user._id,
    taskId: task._id,
    taskTitle: task.title,
    roomId: task.roomId,
    completedAt: new Date(),
    points: task.points,
    tag: task.tag,
  });

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  await UserMonthlyStats.findOneAndUpdate(
    { userId: user._id, month },
    {
      $inc: {
        experience: task.points,
        tasksCompleted: 1,
      },
      $setOnInsert: {
        levelSnapshot: user.level,
      },
    },
    { upsert: true }
  );
};
```

---

## 🚚 Migration Script

Seeds current `User` experience data into `UserMonthlyStats`.

### `migrateUserStats.js`

```js
export const migrateUserStats = async () => {
  const users = await User.find({});
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let migrated = 0;
  for (const user of users) {
    const exists = await UserMonthlyStats.findOne({ userId: user._id, month });
    if (!exists) {
      await UserMonthlyStats.create({
        userId: user._id,
        month,
        experience: user.experience,
        levelSnapshot: user.level,
        tasksCompleted: 0,
      });
      migrated++;
    }
  }

  console.log(`Migrated ${migrated} users to UserMonthlyStats`);
};
```

---

## 🕒 Cron Setup

Use `node-cron` to run the reset on the first day of each month:

```bash
npm install node-cron
```

### `cron.js`

```js
import cron from "node-cron";
import { resetMonthlyStats } from "./jobs/resetMonthlyStats.js";

cron.schedule("0 0 1 * *", () => {
  resetMonthlyStats();
  console.log("Monthly reset job triggered");
});
```

---

## ✅ Summary

| Component             | Responsibility                   |
| --------------------- | -------------------------------- |
| `UserMonthlyStats`    | Monthly XP/level/tasks           |
| `TaskCompletionLog`   | Log of every task done by user   |
| `UserActivityLog`     | Summary of user actions per room |
| `resetMonthlyStats()` | Monthly snapshot creator         |
| `completeTask()`      | Task logic: XP + logging         |
| `migrateUserStats()`  | One-time seeder                  |
| `node-cron`           | Runs monthly reset               |

---