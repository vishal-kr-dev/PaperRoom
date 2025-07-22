"use client";

import React, { useEffect, useState } from "react";
import { useUserActivityStore } from "@/stores/userActivityStore";
import { ActivityItem } from "./ActivityItem";
// import { ActivityFilters } from "./ActivityFilters";
import { Pagination } from "./Pagination";
// import { LoadingSpinner } from "./LoadingSpinner";
import LoadingSpinner from "./LoadingSpinner";
import { ActionType } from "@/types/userActivity";

interface ActivityListProps {
    userId?: string;
    roomId?: string;
    showFilters?: boolean;
    className?: string;
}

export const ActivityList: React.FC<ActivityListProps> = ({
    userId,
    roomId,
    showFilters = true,
    className = "",
}) => {
    const {
        activities,
        pagination,
        loading,
        error,
        filters,
        fetchActivities,
        setFilters,
        clearError,
    } = useUserActivityStore();
    console.log(
        "Activities \n", activities
    )

    const [localFilters, setLocalFilters] = useState({
        action: filters.action || "",
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
    });

    useEffect(() => {
        const initialFilters = {
            ...filters,
            ...(userId && { userId }),
            ...(roomId && { roomId }),
        };
        fetchActivities(initialFilters);
    }, [fetchActivities, userId, roomId]);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);

        const filterUpdate: any = { [key]: value || undefined, page: 1 };
        setFilters(filterUpdate);
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    if (error) {
        return (
            <div className={`${className}`}>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Error loading activities
                            </h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                {error}
                            </p>
                            <button
                                onClick={clearError}
                                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Activity Feed
                </h2>
                {pagination && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pagination.totalItems} total activities
                    </p>
                )}
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Action
                            </label>
                            <select
                                value={localFilters.action}
                                onChange={(e) =>
                                    handleFilterChange("action", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Actions</option>
                                <option value="created">Created</option>
                                <option value="completed">Completed</option>
                                <option value="updated">Updated</option>
                                <option value="deleted">Deleted</option>
                                <option value="archived">Archived</option>
                                <option value="earned_badge">
                                    Earned Badge
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sort By
                            </label>
                            <select
                                value={localFilters.sortBy}
                                onChange={(e) =>
                                    handleFilterChange("sortBy", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="action">Action</option>
                                <option value="taskSnapshot.xp">XP</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sort Order
                            </label>
                            <select
                                value={localFilters.sortOrder}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "sortOrder",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            {/* Activities List */}
            {!loading && (
                <>
                    {activities?.length > 0 ? (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <ActivityItem
                                    key={activity._id}
                                    activity={activity}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                                📋
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No activities found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your filters to see more
                                activities.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            hasNextPage={pagination.hasNextPage}
                            hasPrevPage={pagination.hasPrevPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};
