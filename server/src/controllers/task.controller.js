import mongoose from "mongoose";
import { MonthlyStats } from "../models/MonthlyStats.model.js";
import { Task } from "../models/Task.model.js";
import { UserActivity } from "../models/UserActivity.model.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { calculateTaskPoints } from "../utils/xp/calculateTaskPoints.js";
import { Stats } from "../models/Stats.model.js";
import { RoomDailyStats } from "../models/RoomDailyStats.js";
import { Room } from "../models/Room.model.js";
import { DailyStats } from "../models/DailyStats.model.js";
import { User } from "../models/User.model.js";
import { getISTMidnightDate } from "../utils/getISTMidnightDate.js";

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
                taskSnapshot: {
                    title: task.title,
                    tag: task.tag,
                    priority: task.priority,
                    dailyTask: task.dailyTask,
                },
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
    const roomId = req.user.roomId;
    const userId = req.user._id.toString();

    const tasks = await Task.find({
        roomId,
        isDeleted: false,
    });

    if (tasks.length === 0) {
        return sendResponse(res, 200, [], "No tasks found");
    }

    const todayIST = getISTMidnightDate();

    const resetPromises = tasks.map(async (task) => {
        if (task.dailyTask) {
            const taskUpdatedAtIST = getISTMidnightDate(task.updatedAt);

            const isNotUpdatedToday =
                taskUpdatedAtIST.getTime() !== todayIST.getTime();

            if (isNotUpdatedToday && task.completedBy.length > 0) {
                task.completedBy = [];
                task.updatedAt = new Date(); 
                await task.save();
            }
        }
    });

    await Promise.all(resetPromises);

    const transformedTasks = tasks.map((task) => {
        const isCompleted = task.completedBy.some(
            (id) => id.toString() === userId
        );

        return {
            ...task.toObject(),
            id: task._id.toString(),
            isCompleted,
        };
    });

    return sendResponse(
        res,
        200,
        transformedTasks,
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
                taskSnapshot: {
                    title: updatedTask.title,
                    tag: updatedTask.tag,
                    priority: updatedTask.priority,
                    dailyTask: updatedTask.dailyTask,
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
            const task = await Task.findOne({
                _id: id,
                roomId: user.roomId,
                isDeleted: false,
            }).session(session);

            if (!task) {
                throw new APIerror(404, "Task not found");
            }

            const roomUsers = await User.find({
                roomId: user.roomId,
            }).session(session);

            if (roomUsers.length === 0) {
                throw new APIerror(400, "No users found in the room");
            }

            const completedUsers = task.completedBy.length;
            const totalUsers = roomUsers.length;

            const canDelete =
                completedUsers === 0 || completedUsers === totalUsers;

            if (!canDelete) {
                throw new APIerror(
                    400,
                    `Cannot delete task. ${completedUsers} out of ${totalUsers} users have completed this task. ` +
                        "Deletion is only allowed when no one has completed the task or when everyone has completed it."
                );
            }

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

            const newActivity = new UserActivity({
                userId: user._id,
                roomId: user.roomId,
                taskId: deletedTask._id,
                action: "deleted",
                taskSnapshot: {
                    title: deletedTask.title,
                    tag: deletedTask.tag,
                    priority: deletedTask.priority,
                    dailyTask: deletedTask.dailyTask,
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
                    taskSnapshot: {
                        title: completedTask.title,
                        tag: completedTask.tag,
                        priority: completedTask.priority,
                        dailyTask: completedTask.dailyTask,
                        xp: completedTask.xp,
                    },
                }).save({ session }),

                // Daily stats add/update
                DailyStats.findOneAndUpdate(
                    {
                        userId: user._id,
                        roomId: user.roomId,
                        date,
                    },
                    {
                        $inc: { xp: completedTask.xp, tasksCompleted: 1 },
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

const markIncomplete = asyncHandler(async (req, res) => {
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

    if (!task.completedBy || !task.completedBy.includes(user._id)) {
        throw new APIerror(
            400,
            "Task not completed by this user, cannot mark as incomplete"
        );
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // 1. Update the task to remove the user from completedBy
            const incompleteTask = await Task.findOneAndUpdate(
                {
                    _id: id,
                    roomId: user.roomId,
                },
                {
                    $pull: { completedBy: user._id }, // Remove the user from completedBy
                },
                {
                    new: true,
                    session,
                }
            );

            if (!incompleteTask) {
                throw new APIerror(500, "Failed to mark task as incomplete");
            }

            // 2. Delete activity log for this task completion
            await UserActivity.deleteMany({
                userId: user._id,
                taskId: incompleteTask._id,
                action: "completed", // Only delete 'completed' action
            });

            // 3. Adjust user stats, decrement XP or tasksCompleted, etc.
            const date = new Date().toISOString().split("T")[0]; // For daily stats

            // Remove XP from DailyStats
            await DailyStats.findOneAndUpdate(
                {
                    userId: user._id,
                    roomId: user.roomId,
                    date,
                },
                {
                    $inc: { xp: -incompleteTask.xp, tasksCompleted: -1 },
                },
                {
                    upsert: true,
                    new: true,
                    session,
                }
            );

            // Remove task count from MonthlyStats
            const month = `${new Date().getFullYear()}-${String(
                new Date().getMonth() + 1
            ).padStart(2, "0")}`;
            await MonthlyStats.findOneAndUpdate(
                {
                    userId: user._id,
                    roomId: user.roomId,
                    month,
                },
                {
                    $inc: { xp: -incompleteTask.xp, totalTasksCompleted: -1 },
                },
                {
                    upsert: true,
                    new: true,
                    session,
                }
            );

            // 4. Remove user from active users in RoomDailyStats
            await RoomDailyStats.findOneAndUpdate(
                {
                    roomId: user.roomId,
                    date,
                },
                {
                    $pull: { activeUserIds: user._id },
                    $inc: {
                        totalXP: -incompleteTask.xp,
                        totalTasksCompleted: -1,
                    },
                },
                {
                    upsert: true,
                    new: true,
                    session,
                }
            );

            return incompleteTask;
        });

        // Return success response
        const updatedTask = await Task.findById(id);
        return sendResponse(
            res,
            200,
            updatedTask,
            "Task marked as incomplete successfully"
        );
    } catch (error) {
        throw new APIerror(
            500,
            error.message || "Failed to mark task as incomplete"
        );
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

export {
    createNewTask,
    getAllTasks,
    updateTask,
    deleteTask,
    markComplete,
    markIncomplete,
};
