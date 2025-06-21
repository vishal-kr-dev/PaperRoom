import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    logout: (skipApiCall?: boolean) => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => {
        set({ user, isAuthenticated: true });
    },

    logout: async (skipApiCall = false) => {
        if (!skipApiCall) {
            try {
                await axiosInstance.post("/auth/logout");
            } catch (err) {
                console.error("Logout failed:", err);
            }
        }
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            console.log("User data", res)
            const user = res.data.data;
            set({ user, isAuthenticated: true });
        } catch (err) {
            set({ user: null, isAuthenticated: false });
        }
    },
}));
