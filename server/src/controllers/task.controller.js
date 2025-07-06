import mongoose from "mongoose";
import { MonthlyStats } from "../models/MonthlyStats.model.js";
import {Task} from "../models/Task.model.js";
import { UserActivity } from "../models/UserActivity.model.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { calculateTaskPoints } from "../utils/xp/calculateTaskPoints.js";
import { Stats } from "../models/Stats.model.js";
import { RoomDailyStats } from "../models/RoomDailyStats.js";
import { Room } from "../models/Room.model.js";
import { DailyStats } from "../models/DailyStats.model.js";

const createNewTask = asyncHandler(async (req, res) => {
    const { title, description, subtasks, tag, priority, dailyTask, deadline } =
        req.body;
    const user = req.user;

    const xp = calculateTaskPoints({
        title,
        description,
        subtasks,
        tag,
        priority,
        dailyTask,
        deadline,
    });
    
    const session = await mongoose.startSession();
    
    try {
        const result = await session.withTransaction(async () => {
            const task = new Task({
                title,
                description,
                xp,
                subtasks,
                tag,
                priority,
                dailyTask,
                deadline,
                createdBy: user._id,
                roomId: user.roomId,
            });

            await task.save({ session });

            const newActivity = new UserActivity({
                userId: user._id,
                roomId: user.roomId,
                action: "created",
                taskId: task._id,
                xp,
                taskTittle: task.title
            });

            await newActivity.save({ session });

            return task;
        });

        return sendResponse(res, 200, result, "Task created successfully");
    } catch (error) {
        throw new APIerror(500, error.message || "Failed to create task");
    } finally {
        await session.endSession();
    }
});

const getAllTasks = asyncHandler(async (req, res) => {
    const user = req.user

    const tasks = await Task.find({
        roomId: req.user.roomId,
        isDeleted: false,
    });

    const categorizedTasks = {
        all: tasks,
        inProgress: tasks.filter((task) => !task.completedBy.includes(user._id)),
        completed: tasks.filter((task) => task.completedBy.includes(user._id)),
        daily: tasks.filter((task) => task.dailyTask === true),
        urgent: tasks.filter(
            (task) => task.priority === "urgent" || task.isUrgent
        ),
    };

    return sendResponse(
        res,
        200,
        categorizedTasks,
        "Tasks fetched successfully"
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;

    if (!id) {
        throw new APIerror(400, "Task ID is required");
    }

    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {
            const originalTask = await Task.findOne({
                _id: id,
                roomId: user.roomId,
                isDeleted: false,
            }).session(session);

            if (!originalTask) {
                throw new APIerror(404, "Task not found");
            }

            const updatedTask = await Task.findOneAndUpdate(
                {
                    _id: id,
                    roomId: user.roomId,
                    isDeleted: false,
                },
                {
                    ...updates,
                    updatedAt: new Date(),
                },
                {
                    new: true,
                    session,
                }
            );

            if (!updatedTask) {
                throw new APIerror(404, "Task not found");
            }

            const newActivity = new UserActivity({
                userId: user._id,
                roomId: user.roomId,
                taskId: updatedTask._id,
                action: "updated",
                xp: 0,
                taskSnapshot: {
                    title: updatedTask.title,
                    difficulty: updatedTask.difficulty,
                },
            });

            await newActivity.save({ session });

            return updatedTask;
        });

        return sendResponse(res, 200, result, "Task updated successfully");
    } catch (error) {
        throw new APIerror(500, error.message || "Failed to update task");
    } finally {
        await session.endSession();
    }
});

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
        throw new APIerror(400, "Task ID is required");
    }

    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {
            const deletedTask = await Task.findOneAndUpdate(
                {
                    _id: id,
                    roomId: user.roomId,
                    isDeleted: false,
                },
                {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
                {
                    new: true,
                    session,
                }
            );

            if (!deletedTask) {
                throw new APIerror(404, "Task not found");
            }

            // Create activity record for task deletion
            const newActivity = new UserActivity({
                userId: user._id,
                roomId: user.roomId,
                taskId: deletedTask._id,
                action: "deleted",
                xp: 0,
                taskSnapshot: {
                    title: deletedTask.title,
                    difficulty: deletedTask.difficulty,
                },
            });

            await newActivity.save({ session });

            return deletedTask;
        });

        return sendResponse(res, 200, result, "Task deleted successfully");
    } catch (error) {
        throw new APIerror(500, error.message || "Failed to delete task");
    } finally {
        await session.endSession();
    }
});

const markComplete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
        throw new APIerror(400, "Task ID is required");
    }

    if (!user) {
        throw new APIerror(401, "User authentication required");
    }

    const task = await Task.findOne({
        _id: id,
        roomId: user.roomId,
    });

    if (!task) {
        throw new APIerror(
            404,
            "Task not found or you don't have access to this task"
        );
    }

    if (task.completedBy && task.completedBy.includes(user._id)) {
        throw new APIerror(400, "Task already completed by this user");
    }

    const joinedRoom = await Room.findById(user.roomId);
    const members = joinedRoom.members.length; // Fixed: removed ()

    // Added missing date variables with year-month format (IST)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + istOffset);
    const date = istDate.toISOString().split("T")[0];
    const month = `${istDate.getFullYear()}-${String(
        istDate.getMonth() + 1
    ).padStart(2, "0")}`; // Format: YYYY-MM

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // 1. Update the task
            const completedTask = await Task.findOneAndUpdate(
                {
                    _id: id,
                    roomId: user.roomId,
                },
                {
                    $addToSet: { completedBy: user._id },
                },
                {
                    new: true,
                    session,
                }
            );

            if (!completedTask) {
                throw new APIerror(500, "Failed to mark task as completed");
            }

            // Find or create user stats
            const userStats = await Stats.findOrCreateForUser(
                user._id,
                session
            );

            // Get current room stats to calculate new average
            const currentRoomStats = await RoomDailyStats.findOne({
                roomId: user.roomId,
                date,
            });

            // Check if this user has already completed a task today
            const userAlreadyActive =
                currentRoomStats &&
                currentRoomStats.activeUserIds &&
                currentRoomStats.activeUserIds.includes(user._id);

            // Calculate new average XP per active user
            const currentTotalXP = currentRoomStats
                ? currentRoomStats.totalXP
                : 0;
            const newTotalXP = currentTotalXP + completedTask.xp;

            // Count unique active users
            const currentActiveUsers = currentRoomStats
                ? currentRoomStats.activeUserIds
                    ? currentRoomStats.activeUserIds.length
                    : 0
                : 0;
            const newActiveUsers = userAlreadyActive
                ? currentActiveUsers
                : currentActiveUsers + 1;

            const newAvgXpPerUser = newTotalXP / newActiveUsers;

            await Promise.all([
                // Update user stats using schema methods
                (async () => {
                    userStats.addExperience(completedTask.xp, user.level);
                    await userStats.updateStreak(session);
                })(),

                // Create activity record
                new UserActivity({
                    userId: user._id,
                    roomId: user.roomId,
                    taskId: completedTask._id,
                    action: "completed",
                    xp: completedTask.xp || 100,
                    taskTitle: completedTask.title,
                }).save({ session }),

                // Daily stats add/update
                DailyStats.findOneAndUpdate(
                    {
                        userId: user._id,
                        roomId: user.roomId,
                        date,
                    },
                    {
                        $inc: { xp: completedTask.xp, totalTasksCompleted: 1 },
                    },
                    {
                        upsert: true,
                        new: true,
                        session,
                    }
                ),

                // Room stats with calculated average
                RoomDailyStats.findOneAndUpdate(
                    {
                        roomId: user.roomId,
                        date,
                    },
                    {
                        $inc: {
                            totalXP: completedTask.xp,
                            totalTasksCompleted: 1,
                        },
                        $addToSet: {
                            activeUserIds: user._id, // Track unique active users
                        },
                        $set: {
                            avgXpPerUser: newAvgXpPerUser, // Store calculated average directly
                        },
                    },
                    {
                        upsert: true,
                        new: true,
                        session,
                    }
                ),

                // Update monthly statistics with year-month format
                MonthlyStats.findOneAndUpdate(
                    {
                        userId: user._id,
                        roomId: user.roomId,
                        month, // Now includes year: YYYY-MM
                    },
                    {
                        $inc: { xp: completedTask.xp, totalTasksCompleted: 1 },
                        $set: { levelSnapshot: user.level },
                    },
                    {
                        upsert: true,
                        new: true,
                        session,
                    }
                ),
            ]);

            return completedTask;
        });

        const updatedTask = await Task.findById(id);
        return sendResponse(
            res,
            200,
            updatedTask,
            "Task marked as completed successfully"
        );
    } catch (error) {
        throw new APIerror(500, error.message || "Failed to complete task");
    } finally {
        await session.endSession();
    }
});

// Example usage in other places:
const getUserStats = asyncHandler(async (req, res) => {
    const user = req.user;
    const stats = await Stats.findOrCreateForUser(user._id);
    const streakStatus = stats.getStreakStatus();

    return sendResponse(
        res,
        200,
        {
            ...stats.toObject(),
            streakStatus,
        },
        "User stats retrieved successfully"
    );
});

export { createNewTask, getAllTasks, updateTask, deleteTask, markComplete };
