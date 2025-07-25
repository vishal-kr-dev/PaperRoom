// store/authStore.ts
import axiosInstance from "@/lib/axiosInstance";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            isInitialized: false,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            setLoading: (loading) => set({ isLoading: loading }),

            setInitialized: (initialized) =>
                set({ isInitialized: initialized }),

            logout: async () => {
                try {
                    await axiosInstance.post("/auth/logout");
                } catch (err) {
                    console.error("Something went wrong while login out: ", err);
                }
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
