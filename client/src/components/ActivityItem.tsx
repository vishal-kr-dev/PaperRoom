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
            return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
        case "completed":
            return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
        case "deleted":
            return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
        case "archived":
            return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50";
        case "updated":
            return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
        case "earned_badge":
            return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
        default:
            return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50";
    }
};

const getPriorityColor = (priority?: string) => {
    switch (priority) {
        case "urgent":
            return "text-red-600 dark:text-red-400";
        case "high":
            return "text-orange-600 dark:text-orange-400";
        case "medium":
            return "text-yellow-600 dark:text-yellow-400";
        case "low":
            return "text-green-600 dark:text-green-400";
        default:
            return "text-gray-600 dark:text-gray-400";
    }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    const user = typeof activity.userId === "object" ? activity.userId : null;
    const room = typeof activity.roomId === "object" ? activity.roomId : null;
    const task = typeof activity.taskId === "object" ? activity.taskId : null;

    const getActionText = () => {
        const userName = user?.username || "User";
        const taskTitle =
            activity.taskSnapshot?.title || task?.title || "a task";

        switch (activity.action) {
            case "created":
                return `${userName} created "${taskTitle}"`;
            case "completed":
                return `${userName} completed "${taskTitle}"`;
            case "deleted":
                return `${userName} deleted "${taskTitle}"`;
            case "archived":
                return `${userName} archived "${taskTitle}"`;
            case "updated":
                return `${userName} updated "${taskTitle}"`;
            case "earned_badge":
                return `${userName} earned a badge`;
            default:
                return `${userName} performed an action`;
        }
    };

    const Icon = getActionIcon(activity.action);

    return (
        <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Action Icon */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(
                    activity.action
                )}`}
            >
                <Icon />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Main Action Text */}
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getActionText()}
                </p>

                {/* Task Details */}
                {activity.taskSnapshot && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {activity.taskSnapshot.tag && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                {activity.taskSnapshot.tag}
                            </span>
                        )}

                        {activity.taskSnapshot.priority && (
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
                                    activity.taskSnapshot.priority
                                )}`}
                            >
                                {activity.taskSnapshot.priority.toUpperCase()}
                            </span>
                        )}

                        {activity.taskSnapshot.dailyTask && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                Daily Task
                            </span>
                        )}

                        {activity.taskSnapshot && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                                +{activity.taskSnapshot.xp} XP
                            </span>
                        )}
                    </div>
                )}

                {/* Timestamp */}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                    })}
                </p>
            </div>

            {/* User Avatar */}
            {user?.avatar && (
                <div className="flex-shrink-0">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={user.avatar}
                        alt={user.username}
                    />
                </div>
            )}
        </div>
    );
};
