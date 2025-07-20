import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "@/stores/authStore";

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await axiosInstance.post(
                "/auth/login",
                credentials
            );
            const user = response.data.data;
            useAuthStore.getState().setUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    },

    signup: async (userData: {
        email: string;
        password: string;
        username: string;
    }) => {
        try {
            const response = await axiosInstance.post("/auth/signup", userData);
            const user = response.data.data;
            return user;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            useAuthStore.getState().logout();
        } catch (error) {
            console.error("Logout failed:", error)
            useAuthStore.getState().logout();
            throw error;
        }
    },
};
