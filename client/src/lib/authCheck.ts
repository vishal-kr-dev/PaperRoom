import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "@/stores/authStore";

export const checkAuthStatus = async () => {
    const { setUser, logout } = useAuthStore.getState();

    try {
        const response = await axiosInstance.get("/auth/me");
        console.log("Auth check done");
        const user = response.data.data;
        setUser(user);
        return { isAuthenticated: true, user };
    } catch (error) {
        logout();
        return { isAuthenticated: false, user: null };
    }
};
