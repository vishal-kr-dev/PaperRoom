import React from "react";
import { UserActivity, ActionType } from "@/types/userActivity";
import { formatDistanceToNow } from "date-fns";
import {
    Archive,
    CircleCheckBig,
    NotebookPen,
    PencilLine,
    Plus,
    Shredder,
    Trophy,
    Clock,
    Star,
} from "lucide-react";

interface ActivityItemProps {
    activity: UserActivity;
}

const getActionIcon = (action: ActionType) => {
    switch (action) {
        case "created":
            return Plus;
        case "completed":
            return CircleCheckBig;
        case "deleted":
            return Shredder;
        case "archived":
            return Archive;
        case "updated":
            return PencilLine;
        case "earned_badge":
            return Trophy;
        default:
            return NotebookPen;
    }
};

const getActionColor = (action: ActionType) => {
    switch (action) {
        case "created":
            return "text-blue-600 dark:text-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700/50";
        case "completed":
            return "text-green-600 dark:text-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-700/50";
        case "deleted":
            return "text-red-600 dark:text-red-400 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-700/50";
        case "archived":
            return "text-gray-600 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/30 border-gray-200 dark:border-gray-600/50";
        case "updated":
            return "text-amber-600 dark:text-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 border-amber-200 dark:border-amber-700/50";
        case "earned_badge":
            return "text-purple-600 dark:text-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-700/50";
        default:
            return "text-gray-600 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/30 border-gray-200 dark:border-gray-600/50";
    }
};

const getPriorityConfig = (priority?: string) => {
    switch (priority) {
        case "urgent":
            return {
                color: "text-red-700 dark:text-red-300",
                bg: "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/40",
                border: "border-red-300 dark:border-red-600/50",
                pulse: "animate-pulse",
            };
        case "high":
            return {
                color: "text-orange-700 dark:text-orange-300",
                bg: "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/40",
                border: "border-orange-300 dark:border-orange-600/50",
                pulse: "",
            };
        case "medium":
            return {
                color: "text-yellow-700 dark:text-yellow-300",
                bg: "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/40",
                border: "border-yellow-300 dark:border-yellow-600/50",
                pulse: "",
            };
        case "low":
            return {
                color: "text-green-700 dark:text-green-300",
                bg: "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/40",
                border: "border-green-300 dark:border-green-600/50",
                pulse: "",
            };
        default:
            return {
                color: "text-gray-700 dark:text-gray-300",
                bg: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/40",
                border: "border-gray-300 dark:border-gray-600/50",
                pulse: "",
            };
    }
};

const getActionVerb = (action: ActionType) => {
    switch (action) {
        case "created":
            return "created";
        case "completed":
            return "completed";
        case "deleted":
            return "deleted";
        case "archived":
            return "archived";
        case "updated":
            return "updated";
        case "earned_badge":
            return "earned";
        default:
            return "performed an action on";
    }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    const user = typeof activity.userId === "object" ? activity.userId : null;
    const task = typeof activity.taskId === "object" ? activity.taskId : null;

    const taskTitle = activity.taskSnapshot?.title || task?.title || "a task";
    const userName = user?.username || "User";
    const actionVerb = getActionVerb(activity.action);
    const Icon = getActionIcon(activity.action);
    const priorityConfig = getPriorityConfig(activity.taskSnapshot?.priority);

    return (
        <div className="group relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent dark:via-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

            <div className="relative flex items-start space-x-4 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30 transition-all duration-300 hover:-translate-y-1">
                {/* Action Icon with enhanced styling */}
                <div className="flex-shrink-0 relative">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${getActionColor(
                            activity.action
                        )} border transition-transform duration-200 group-hover:scale-110 shadow-sm`}
                    >
                        <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>

                    {/* Subtle glow effect */}
                    <div
                        className={`absolute inset-0 rounded-xl ${
                            getActionColor(activity.action).split(" ")[0]
                        } opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40`}
                    ></div>
                </div>

                {/* Content with improved typography */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Main Action Text with better formatting */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {userName}
                                </span>{" "}
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                    {actionVerb}
                                </span>{" "}
                                {activity.action !== "earned_badge" && (
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
                                        &quot;{taskTitle}&quot;
                                    </span>
                                )}
                                {activity.action === "earned_badge" && (
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">
                                        a new badge!
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* User Avatar with improved styling */}
                        {user?.avatar && (
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-sm transition-transform duration-200 group-hover:scale-105"
                                        src={user.avatar}
                                        alt={user.username}
                                    />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20 dark:to-gray-800/20"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Task Details */}
                    {activity.taskSnapshot && (
                        <div className="flex flex-wrap gap-2">
                            {activity.taskSnapshot.tag && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-600">
                                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-300 rounded-full mr-2"></span>
                                    {activity.taskSnapshot.tag}
                                </span>
                            )}

                            {activity.taskSnapshot.priority && (
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${priorityConfig.bg} ${priorityConfig.color} ${priorityConfig.border} ${priorityConfig.pulse}`}
                                >
                                    <Star
                                        className="w-3 h-3 mr-1.5"
                                        fill="currentColor"
                                    />
                                    {activity.taskSnapshot.priority.toUpperCase()}
                                </span>
                            )}

                            {activity.taskSnapshot.dailyTask && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 shadow-sm">
                                    <Clock className="w-3 h-3 mr-1.5" />
                                    Daily Task
                                </span>
                            )}

                            {(activity.taskSnapshot.xp ?? 0) > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700 shadow-sm">
                                    <Trophy className="w-3 h-3 mr-1.5" />+
                                    {activity.taskSnapshot.xp} XP
                                </span>
                            )}
                        </div>
                    )}

                    {/* Enhanced Timestamp */}
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                            {formatDistanceToNow(new Date(activity.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
