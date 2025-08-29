"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Trophy,
    Calendar,
    Star,
    Check,
    Clock,
    AlertTriangle,
    List,
    Edit,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import TaskCard from "@/components/TaskCard";
import { toast } from "sonner";
import { useRoomStore } from "@/stores/roomStore";
import { useTaskStore } from "@/stores/taskStore";
import { Subtask, Task } from "@/types/task";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TaskFormData {
    title: string;
    description: string;
    subtasks: { title: string }[];
    tag: string;
    priority: "low" | "medium" | "high" | "urgent";
    dailyTask: boolean;
    deadline: string;
    isCompleted: boolean;
}

const validateTask = (data: TaskFormData): string | null => {
    if (data.dailyTask && data.deadline) {
        return "A task cannot be both daily and have a deadline. Please remove one of these options.";
    }
    return null;
};

const TaskBoard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [expandedTask, setExpandedTask] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const room = useRoomStore((s) => s.room);

    const {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTaskAsync,
        updateTaskAsync,
        clearError,
    } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const {
        register,
        handleSubmit,
        // control,
        reset,
        watch,
        formState: { errors },
    } = useForm<TaskFormData>({
        defaultValues: {
            title: "",
            description: "",
            subtasks: [],
            tag: "",
            priority: "medium",
            dailyTask: false,
            deadline: "",
            isCompleted: false,
        },
    });

    const watchedValues = watch();

    const prepareEditForm = (task: Task) => {
        setCurrentTaskId(task._id);
        setIsEditMode(true);
        setIsModalOpen(true);

        reset({
            title: task.title,
            description: task.description,
            subtasks: task.subtasks.map((st) => ({ title: st.title })),
            tag: task.tag,
            priority: task.priority,
            dailyTask: task.dailyTask,
            deadline: task.deadline || "",
            isCompleted: task.isCompleted,
        });
    };

    const onSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true);
        const validationError = validateTask(data);
        if (validationError) {
            setFormError(validationError);
            setIsSubmitting(false);
            return;
        }

        setFormError(null);

        const baseTaskData = {
            title: data.title,
            description: data.description || "",
            tag: data.tag,
            priority: data.priority,
            dailyTask: data.dailyTask,
            deadline: data.deadline || null,
            isCompleted: data.isCompleted,
            subtasks: data.subtasks.map((st, index) => ({
                _id: `temp-${Date.now()}-${index}`,
                title: st.title,
                completed: false,
            })) as Subtask[],
        };
        console.log("btd", baseTaskData);

        const taskData: Omit<Task, "_id"> = {
            ...baseTaskData,
            completedBy: [],
            createdBy: "",
            roomId: room?._id || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        console.log("td", taskData);

        try {
            if (isEditMode && currentTaskId) {
                const existingTask = tasks.find((t) => t._id === currentTaskId);
                const updateData: Task = {
                    ...taskData,
                    _id: currentTaskId,
                    completedBy: existingTask?.completedBy || [],
                    createdBy: existingTask?.createdBy || taskData.createdBy,
                    createdAt: existingTask?.createdAt || taskData.createdAt,
                    updatedAt: new Date(),
                };
                await updateTaskAsync(updateData, currentTaskId);
            } else {
                await createTaskAsync(taskData);
            }

            if (!error) {
                toast.success("Task saved successfully!");
                reset();
                setIsModalOpen(false);
                setIsEditMode(false);
                setCurrentTaskId(null);
            }
        } catch (error) {
            console.error("Error saving task:", error);
            toast.error("Failed to save task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSubtask = async (taskId: string, subtaskId: string) => {
        try {
            const task = tasks.find((t) => t._id === taskId);
            if (!task) return;

            const subtask = task.subtasks.find((st) => st._id === subtaskId);
            if (!subtask) return;

            await axiosInstance.put(`/tasks/${taskId}/subtasks/${subtaskId}`, {
                completed: !subtask.completed,
            });

            await fetchTasks();
        } catch (error) {
            console.error("Error toggling subtask:", error);
        }
    };

    const filteredTasks = React.useMemo(() => {
        switch (activeTab) {
            case "completed":
                return tasks.filter((task) => task.isCompleted);
            case "pending":
                return tasks.filter((task) => !task.isCompleted);
            case "daily":
                return tasks.filter((task) => task.dailyTask);
            case "urgent":
                return tasks.filter((task) => task.priority === "urgent");
            default:
                return tasks;
        }
    }, [tasks, activeTab]);

    const totalXp = tasks.reduce((total, task) => total + (task.xp ?? 0), 0);
    const completedXp = tasks
        .filter((task) => task.isCompleted)
        .reduce((total, task) => total + (task.xp ?? 0), 0);
    const completionPercentage =
        tasks.length > 0 ? Math.round((completedXp / totalXp) * 100) : 0;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Task Board
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Complete tasks and track your progress
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                                {completedXp} / {totalXp} XP
                            </span>
                            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    style={{
                                        width: `${completionPercentage}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsEditMode(false);
                                setCurrentTaskId(null);
                                reset();
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Task</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                    {[
                        {
                            id: "all",
                            label: "All Tasks",
                            icon: <List className="w-4 h-4" />,
                        },
                        {
                            id: "pending",
                            label: "Pending",
                            icon: <Clock className="w-4 h-4" />,
                        },
                        {
                            id: "completed",
                            label: "Completed",
                            icon: <Check className="w-4 h-4" />,
                        },
                        {
                            id: "daily",
                            label: "Daily",
                            icon: <Calendar className="w-4 h-4" />,
                        },
                        {
                            id: "urgent",
                            label: "Urgent",
                            icon: <AlertTriangle className="w-4 h-4" />,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            expandedTask={expandedTask}
                            setExpandedTask={setExpandedTask}
                            toggleSubtask={toggleSubtask}
                            prepareEditForm={prepareEditForm}
                        />
                    ))}

                    {filteredTasks.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4 border border-indigo-200 dark:border-indigo-800">
                                {activeTab === "completed" ? (
                                    <Trophy className="w-10 h-10 text-indigo-500" />
                                ) : activeTab === "pending" ? (
                                    <Clock className="w-10 h-10 text-blue-500" />
                                ) : activeTab === "urgent" ? (
                                    <AlertTriangle className="w-10 h-10 text-red-500" />
                                ) : (
                                    <List className="w-10 h-10 text-indigo-500" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                {activeTab === "completed"
                                    ? "No completed tasks yet!"
                                    : activeTab === "pending"
                                    ? "No pending tasks"
                                    : activeTab === "urgent"
                                    ? "No urgent tasks"
                                    : "No tasks yet!"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                {activeTab === "completed"
                                    ? "Complete some tasks to track your progress!"
                                    : activeTab === "pending"
                                    ? "All tasks are completed!"
                                    : activeTab === "urgent"
                                    ? "Mark tasks as urgent to prioritize them"
                                    : "Create your first task to get started"}
                            </p>
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setIsEditMode(false);
                                    setCurrentTaskId(null);
                                    reset();
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {activeTab === "all"
                                    ? "Create First Task"
                                    : "New Task"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {isEditMode ? (
                                        <>
                                            <Edit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            Edit Task
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            New Task
                                        </>
                                    )}
                                </h2>
                            </div>

                            {formError && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    {formError}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Task Title
                                    </label>
                                    <input
                                        {...register("title", {
                                            required: "Title is required",
                                        })}
                                        placeholder="What needs to be done?"
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        placeholder="Add details..."
                                        rows={3}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tag
                                        </label>
                                        <select
                                            {...register("tag", {
                                                required:
                                                    "Tag selection in required",
                                            })}
                                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select tag</option>
                                            {room?.tags?.map((tag, index) => (
                                                <option key={index} value={tag}>
                                                    {tag}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tag && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.tag.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Priority
                                        </label>
                                        <select
                                            {...register("priority")}
                                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                            <option value="urgent">
                                                Urgent
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            {...register("deadline")}
                                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={watchedValues.dailyTask}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="dailyTask"
                                        {...register("dailyTask")}
                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        htmlFor="dailyTask"
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>Daily Task (+15 XP Bonus)</span>
                                    </label>
                                </div>

                                {/* <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Subtasks
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                appendSubtask({ title: "" })
                                            }
                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Subtask
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {subtaskFields.length === 0 && (
                                            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                                No subtasks added yet
                                            </div>
                                        )}
                                        {subtaskFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    {...register(
                                                        `subtasks.${index}.title`,
                                                        {
                                                            required:
                                                                "Subtask title is required",
                                                        }
                                                    )}
                                                    placeholder="Subtask description"
                                                    className="flex-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                                {errors.subtasks?.[index]
                                                    ?.title && (
                                                    <p className="text-sm text-red-600 dark:text-red-400">
                                                        {
                                                            errors.subtasks?.[
                                                                index
                                                            ]?.title?.message
                                                        }
                                                    </p>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSubtask(index)
                                                    }
                                                    className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setFormError(null);
                                            reset();
                                            setIsEditMode(false);
                                            setCurrentTaskId(null);
                                        }}
                                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting && (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {isSubmitting
                                            ? isEditMode
                                                ? "Updating..."
                                                : "Creating..."
                                            : isEditMode
                                            ? "Update Task"
                                            : "Create Task"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
