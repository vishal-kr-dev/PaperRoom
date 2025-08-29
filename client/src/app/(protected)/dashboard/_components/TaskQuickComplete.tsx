import React, { useEffect } from "react";
import { Check, Clock, AlertCircle, Flag } from "lucide-react";
import { useTaskStore } from "@/stores/taskStore";

// Priority color mapping
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "urgent":
            return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
        case "high":
            return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800";
        case "medium":
            return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800";
        case "low":
            return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
        default:
            return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700";
    }
};

// Priority icon mapping
const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case "urgent":
        case "high":
            return AlertCircle;
        default:
            return Flag;
    }
};

const TaskQuickComplete = () => {
    const { tasks, isLoading, taskLoadingStates, markCompleteAsync, fetchTasks } =
        useTaskStore();

    useEffect(() => {
        fetchTasks()
    }, [])
    

    // Filter incomplete tasks
    const incompleteTasks = tasks.filter((task) => !task.isCompleted);

    const handleCompleteTask = async (taskId: string) => {
        try {
            await markCompleteAsync(taskId);
        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (incompleteTasks.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <Check className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    All tasks completed!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Great job! You have no pending tasks.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Pending Tasks
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {incompleteTasks.length} tasks remaining
                </p>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {incompleteTasks.map((task) => {
                    const PriorityIcon = getPriorityIcon(task.priority);
                    const isTaskLoading = taskLoadingStates[task._id];
                    // const incompletedSubtasks = task.subtasks.filter(
                    //     (subtask) => !subtask.completed
                    // );

                    return (
                        <div key={task._id} className="p-4 m-2 ">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {task.title}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(
                                                task.priority
                                            )}`}
                                        >
                                            <PriorityIcon className="w-3 h-3 mr-1" />
                                            {task.priority}
                                        </span>
                                        {task.dailyTask && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                                                Daily
                                            </span>
                                        )}
                                    </div>

                                    {task.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {task.deadline && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    Due:{" "}
                                                    {new Date(
                                                        task.deadline
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* {task.subtasks.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    {task.subtasks.length -
                                                        incompletedSubtasks.length}
                                                    /{task.subtasks.length}{" "}
                                                    subtasks
                                                </span>
                                            </div>
                                        )} */}

                                        {task.xp && (
                                            <div className="flex items-center gap-1">
                                                <span>{task.xp} XP</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCompleteTask(task._id)}
                                    disabled={isTaskLoading ? true : false}
                                    className={`ml-4 flex-shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        isTaskLoading
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    }`}
                                >
                                    {isTaskLoading ? (
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-1"></div>
                                    ) : (
                                        <Check className="w-4 h-4 mr-1" />
                                    )}
                                    Complete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskQuickComplete;
