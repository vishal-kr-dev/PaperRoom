"use client";

import React, { useEffect, useState } from "react";
import { useUserActivityStore } from "@/stores/userActivityStore";
import LoadingSpinner from "./LoadingSpinner";
import {
    Archive,
    CircleCheckBig,
    NotebookPen,
    PencilLine,
    Plus,
    Shredder,
    Trophy,
} from "lucide-react";

interface ActivityStatsProps {
    userId?: string;
    roomId?: string;
    className?: string;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({
    userId,
    roomId,
    className = "",
}) => {
    const { stats, loading, error, fetchStats } = useUserActivityStore();
    const [timeframe, setTimeframe] = useState("7d");

    useEffect(() => {
        fetchStats(userId, roomId, timeframe);
    }, [fetchStats, userId, roomId, timeframe]);

    const getActionDisplayName = (action: string) => {
        switch (action) {
            case "created":
                return "Created";
            case "completed":
                return "Completed";
            case "updated":
                return "Updated";
            case "deleted":
                return "Deleted";
            case "archived":
                return "Archived";
            case "earned_badge":
                return "Badges Earned";
            default:
                return action.charAt(0).toUpperCase() + action.slice(1);
        }
    };

    const getActionIconDetails = (action: string) => {
        switch (action) {
            case "created":
                return { icon: Plus, color: "text-blue-500" };
            case "completed":
                return { icon: CircleCheckBig, color: "text-green-500" };
            case "deleted":
                return { icon: Shredder, color: "text-red-500" };
            case "archived":
                return { icon: Archive, color: "text-gray-500" };
            case "updated":
                return { icon: PencilLine, color: "text-yellow-500" };
            case "earned_badge":
                return { icon: Trophy, color: "text-purple-500" };
            default:
                return { icon: NotebookPen, color: "text-gray-400" };
        }
    };

    if (loading) {
        return (
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
            >
                <div className="flex justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
            >
                <div className="text-center text-red-600 dark:text-red-400">
                    <p>Failed to load stats: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Activity Statistics
                </h3>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="1d">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </select>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">📊</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Total Activities
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {stats?.totalActivities || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">⭐</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                Total XP Earned
                            </p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {stats?.totalXPEarned || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Breakdown */}
            {stats?.actionCounts && stats.actionCounts?.length > 0 ? (
                <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Activity Breakdown
                    </h4>
                    <div className="space-y-3">
                        {stats.actionCounts.map(
                            ({ action, count, totalXP }) => {
                                const { icon: Icon, color } =
                                    getActionIconDetails(action);

                                return (
                                    <div
                                        key={action}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <span
                                                className={`text-lg mr-3 ${color}`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {getActionDisplayName(
                                                        action
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {count}{" "}
                                                    {count === 1
                                                        ? "activity"
                                                        : "activities"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                {count}
                                            </p>
                                            {totalXP > 0 && (
                                                <p className="text-xs text-purple-600 dark:text-purple-400">
                                                    +{totalXP} XP
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">
                        📈
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        No activities found for the selected timeframe
                    </p>
                </div>
            )}
        </div>
    );
};
