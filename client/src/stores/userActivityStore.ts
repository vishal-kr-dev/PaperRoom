import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
    UserActivity,
    ActivityFilters,
    PaginationInfo,
    ActivityStats,
} from "@/types/userActivity";
import axiosInstance from "@/lib/axiosInstance";

interface UserActivityState {
    activities: UserActivity[];
    pagination: PaginationInfo | null;
    stats: ActivityStats | null;
    loading: boolean;
    error: string | null;
    filters: ActivityFilters;

    // Actions
    fetchActivities: (filters?: ActivityFilters) => Promise<void>;
    fetchStats: (
        userId?: string,
        roomId?: string,
        timeframe?: string
    ) => Promise<void>;
    setFilters: (filters: Partial<ActivityFilters>) => void;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    activities: [],
    pagination: null,
    stats: null,
    loading: false,
    error: null,
    filters: {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
    },
};

export const useUserActivityStore = create<UserActivityState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            fetchActivities: async (newFilters?: ActivityFilters) => {
                set({ loading: true, error: null });

                try {
                    const currentFilters = get().filters;
                    const filters = { ...currentFilters, ...newFilters };

                    const queryParams = new URLSearchParams();
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            queryParams.append(key, value.toString());
                        }
                    });

                    const response = await axiosInstance(
                        `/user-activities?${queryParams}`
                    );

                    if (response.status !== 200) {
                        throw new Error(
                            `Failed to fetch activities: ${response.statusText}`
                        );
                    }

                    // const data= response

                    if (response.status === 200) {
                        set({
                            activities: response.data.data.activities,
                            pagination: response.data.data.pagination,
                            filters,
                            loading: false,
                        });
                    } else {
                        throw new Error("Failed to fetch activities");
                    }
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : "An unknown error occurred",
                        loading: false,
                    });
                }
            },

            fetchStats: async (
                userId?: string,
                roomId?: string,
                timeframe = "7d"
            ) => {
                set({ loading: true, error: null });

                try {
                    const queryParams = new URLSearchParams({ timeframe });
                    if (userId) queryParams.append("userId", userId);
                    if (roomId) queryParams.append("roomId", roomId);

                    const response = await axiosInstance.get(
                        `/user-activities/stats?${queryParams}`
                    );

                    if (response.status !== 200) {
                        throw new Error(
                            `Failed to fetch stats: ${response.statusText}`
                        );
                    }

                    if (response.status === 200) {
                        set({
                            stats: response.data.data,
                            loading: false,
                        });
                    } else {
                        throw new Error("Failed to fetch stats");
                    }
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : "An unknown error occurred",
                        loading: false,
                    });
                }
            },

            setFilters: (newFilters: Partial<ActivityFilters>) => {
                const currentFilters = get().filters;
                const updatedFilters = { ...currentFilters, ...newFilters };
                set({ filters: updatedFilters });

                // Auto-fetch with new filters
                get().fetchActivities(updatedFilters);
            },

            clearError: () => set({ error: null }),

            reset: () => set(initialState),
        }),
        {
            name: "user-activity-store",
        }
    )
);
