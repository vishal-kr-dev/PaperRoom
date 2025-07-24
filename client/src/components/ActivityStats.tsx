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
    TrendingUp,
    Calendar,
    Zap,
    BarChart3,
    ChevronDown,
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
                return {
                    icon: Plus,
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
                    border: "border-blue-200 dark:border-blue-700/50",
                };
            case "completed":
                return {
                    icon: CircleCheckBig,
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30",
                    border: "border-green-200 dark:border-green-700/50",
                };
            case "deleted":
                return {
                    icon: Shredder,
                    color: "text-red-600 dark:text-red-400",
                    bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
                    border: "border-red-200 dark:border-red-700/50",
                };
            case "archived":
                return {
                    icon: Archive,
                    color: "text-gray-600 dark:text-gray-400",
                    bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/30",
                    border: "border-gray-200 dark:border-gray-600/50",
                };
            case "updated":
                return {
                    icon: PencilLine,
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30",
                    border: "border-amber-200 dark:border-amber-700/50",
                };
            case "earned_badge":
                return {
                    icon: Trophy,
                    color: "text-purple-600 dark:text-purple-400",
                    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30",
                    border: "border-purple-200 dark:border-purple-700/50",
                };
            default:
                return {
                    icon: NotebookPen,
                    color: "text-gray-600 dark:text-gray-400",
                    bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/30",
                    border: "border-gray-200 dark:border-gray-600/50",
                };
        }
    };

    if (loading) {
        return (
            <div className={`group relative ${className}`}>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 shadow-sm">
                    <div className="flex justify-center items-center">
                        <LoadingSpinner />
                        <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">
                            Loading activity statistics...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`group relative ${className}`}>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-red-200/60 dark:border-red-700/60 p-8 shadow-sm">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-medium">
                            Failed to load statistics
                        </p>
                        <p className="text-red-500 dark:text-red-500 text-sm mt-1">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group relative ${className}`}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/30 to-transparent dark:via-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Header with enhanced styling */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Activity Statistics
                            </h3>

                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="appearance-none px-4 py-2 pl-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                        >
                            <option value="1d">Last 24 hours</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Enhanced Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="group/card relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-400/5 dark:to-indigo-400/5 rounded-2xl"></div>
                        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform duration-200">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-2 flex-1">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                        Total Activities
                                    </p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                        {stats?.totalActivities || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group/card relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-400/5 dark:to-pink-400/5 rounded-2xl"></div>
                        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform duration-200">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-2 flex-1">
                                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                        Total XP Earned
                                    </p>
                                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                        {stats?.totalXPEarned || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Action Breakdown */}
                {stats?.actionCounts && stats.actionCounts?.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Activity Breakdown
                            </h4>
                        </div>

                        <div className="grid gap-4">
                            {stats.actionCounts.map(
                                ({ action, count }) => {
                                    const {
                                        icon: Icon,
                                        color,
                                        bg,
                                        border,
                                    } = getActionIconDetails(action);
                                    const percentage = stats.totalActivities
                                        ? Math.round(
                                              (count / stats.totalActivities) *
                                                  100
                                          )
                                        : 0;

                                    return (
                                        <div
                                            key={action}
                                            className="group/item relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent dark:via-gray-800/30 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                                            <div className="relative flex items-center justify-between p-5 bg-white/60 dark:bg-gray-700/40 rounded-xl border border-gray-200/60 dark:border-gray-600/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm">
                                                <div className="flex items-center space-x-4">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${border} border shadow-sm group-hover/item:scale-110 transition-transform duration-200`}
                                                    >
                                                        <Icon
                                                            className={`w-5 h-5 ${color}`}
                                                            strokeWidth={2}
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                {getActionDisplayName(
                                                                    action
                                                                )}
                                                            </p>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {count}{" "}
                                                            {count === 1
                                                                ? "activity"
                                                                : "activities"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-1">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {count}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
                            <BarChart3 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                No Activities Yet
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                No activities found for the selected timeframe.
                                <br />
                                Start creating tasks to see your stats here!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
