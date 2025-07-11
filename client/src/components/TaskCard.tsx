"use client";

import React from "react";
import {
    Check,
    Clock,
    Flag,
    Star,
    Calendar,
    Tag,
    ChevronDown,
    Edit,
    Trash2,
    Zap,
    Target,
    TrendingUp,
} from "lucide-react";

type PriorityLevel = "low" | "medium" | "high" | "urgent";

interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

interface Task {
    id: string;
    title: string;
    description: string;
    xp: number;
    subtasks: Subtask[];
    tag: string;
    priority: PriorityLevel;
    dailyTask: boolean;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
    isCompleted: boolean;
}

interface TaskCardProps {
    task: Task;
    expandedTask: string | null;
    setExpandedTask: (id: string | null) => void;
    toggleSubtask: (taskId: string, subtaskId: string) => void;
    toggleTaskCompletion: (taskId: string) => void;
    prepareEditForm: (task: Task) => void;
    deleteTask: (taskId: string) => void;
}

type PriorityColorMap = {
    [key in PriorityLevel]: string;
};

type CompletionColorReturn = string;

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    expandedTask,
    setExpandedTask,
    toggleSubtask,
    toggleTaskCompletion,
    prepareEditForm,
    deleteTask,
}) => {
    const getPriorityColor = (priority: PriorityLevel): string => {
        const colorMap: PriorityColorMap = {
            low: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
            medium: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
            high: "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
            urgent: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        };
        return colorMap[priority];
    };

    const getPriorityIcon = (priority: PriorityLevel) => {
        const iconMap = {
            low: <Flag className="w-3 h-3" />,
            medium: <Target className="w-3 h-3" />,
            high: <TrendingUp className="w-3 h-3" />,
            urgent: <Zap className="w-3 h-3" />,
        };
        return iconMap[priority];
    };

    const getCompletionColor = (
        isCompleted: boolean
    ): CompletionColorReturn => {
        return isCompleted
            ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            : "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    };

    const isOverdue = (deadline: string | null): boolean => {
        if (!deadline) return false;
        return new Date(deadline) < new Date() && !task.isCompleted;
    };

    const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
    const totalSubtasks = task.subtasks.length;
    const progressPercentage =
        totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div
            className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
                task.isCompleted
                    ? "border-emerald-200 dark:border-emerald-800/50 shadow-emerald-100/50 dark:shadow-emerald-900/20"
                    : isOverdue(task.deadline)
                    ? "border-red-200 dark:border-red-800/50 shadow-red-100/50 dark:shadow-red-900/20"
                    : "border-gray-200 dark:border-gray-700 shadow-sm"
            }`}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                    task.priority === "urgent"
                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                        : task.priority === "high"
                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                        : task.priority === "medium"
                        ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
            />

            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-xl font-bold mb-1 line-clamp-2 ${
                                task.isCompleted
                                    ? "text-emerald-700 dark:text-emerald-400"
                                    : "text-gray-900 dark:text-white"
                            }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p
                                className={`text-sm line-clamp-2 leading-relaxed ${
                                    task.isCompleted
                                        ? "text-emerald-600/80 dark:text-emerald-400/80"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                {task.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-3 py-1.5 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold border border-indigo-200 dark:border-indigo-800">
                            <Star className="w-3 h-3 fill-current" />
                            {task.xp} XP
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                        )}`}
                    >
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                    </span>

                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCompletionColor(
                            task.isCompleted
                        )}`}
                    >
                        {task.isCompleted ? (
                            <Check className="w-3 h-3 mr-1" />
                        ) : (
                            <Clock className="w-3 h-3 mr-1" />
                        )}
                        {task.isCompleted ? "Completed" : "In Progress"}
                    </span>

                    {task.dailyTask && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Calendar className="w-3 h-3 mr-1" />
                            Daily Task
                        </span>
                    )}
                </div>

                {task.tag && (
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <Tag className="w-3 h-3 mr-1" />
                            {task.tag}
                        </span>
                    </div>
                )}

                {task.subtasks.length > 0 && (
                    <div className="mb-4">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            onClick={() =>
                                setExpandedTask(
                                    expandedTask === task.id ? null : task.id
                                )
                            }
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Subtasks
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                            style={{
                                                width: `${progressPercentage}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                        {completedSubtasks}/{totalSubtasks}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    expandedTask === task.id ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {expandedTask === task.id && (
                            <div
                                className="space-y-2"
                                style={{
                                    animation: "slideIn 0.2s ease-out forwards",
                                }}
                            >
                                {task.subtasks.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-lg cursor-pointer hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-600/50 dark:hover:to-slate-600/50 transition-all duration-200 border border-gray-200 dark:border-gray-600"
                                        onClick={() =>
                                            toggleSubtask(task.id, subtask.id)
                                        }
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                subtask.completed
                                                    ? "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                                    : "border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                            }`}
                                        >
                                            {subtask.completed && (
                                                <Check className="w-3 h-3" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium transition-all duration-200 ${
                                                subtask.completed
                                                    ? "line-through text-gray-500 dark:text-gray-500"
                                                    : "text-gray-700 dark:text-gray-300"
                                            }`}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {task.deadline && (
                    <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                                Due:{" "}
                                {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        </div>
                        {isOverdue(task.deadline) && (
                            <span className="text-xs bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-semibold border border-red-200 dark:border-red-800 animate-pulse">
                                Overdue
                            </span>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
                            task.isCompleted
                                ? "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm"
                                : "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-600 dark:hover:to-slate-600 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                    >
                        {task.isCompleted ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Completed</span>
                            </>
                        ) : (
                            <>
                                <Clock className="w-4 h-4" />
                                <span>Mark Complete</span>
                            </>
                        )}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => prepareEditForm(task)}
                            className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                            title="Edit Task"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-600 dark:text-red-400 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-200 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
                            title="Delete Task"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
