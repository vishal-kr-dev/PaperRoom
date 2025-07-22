import { checkAuthStatus } from "@/lib/authCheck";
import { useAuthStore } from "@/stores/authStore";

export const useForceAuthCheck = () => {
    const { setLoading } = useAuthStore();

    const recheckAuth = async () => {
        setLoading(true);
        const result = await checkAuthStatus();
        setLoading(false);
        return result;
    };

    return { recheckAuth };
};
