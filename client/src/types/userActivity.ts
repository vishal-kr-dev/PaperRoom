export interface User {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
}

export interface Room {
    _id: string;
    name: string;
    description?: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
}

export interface TaskSnapshot {
    title?: string;
    tag?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dailyTask?: boolean;
    xp?: number;
}

export type ActionType =
    | "created"
    | "completed"
    | "deleted"
    | "archived"
    | "updated"
    | "earned_badge";

export interface UserActivity {
    _id: string;
    userId: User | string;
    roomId: Room | string;
    action: ActionType;
    taskId?: Task | string;
    taskSnapshot?: TaskSnapshot;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export interface UserActivitiesResponse {
    success: boolean;
    data: {
        activities: UserActivity[];
        pagination: PaginationInfo;
    };
}

export interface ActivityFilters {
    userId?: string;
    roomId?: string;
    action?: ActionType;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ActivityStats {
    actionCounts: Array<{
        action: ActionType;
        count: number;
        totalXP: number;
    }>;
    totalActivities: number;
    totalXPEarned: number;
}

export interface ActivityStatsResponse {
    success: boolean;
    data: ActivityStats;
}
