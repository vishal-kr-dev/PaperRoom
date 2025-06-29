"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export const useAuthRedirect = (redirectTo: string = "/dashboard") => {
    const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized || isLoading) return;

        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, isInitialized, redirectTo, router]);

    // Return early if we should show loader OR if authenticated (to prevent flash)
    const shouldShowLoader = !isInitialized || isLoading || isAuthenticated;
    const shouldShowContent = isInitialized && !isLoading && !isAuthenticated;

    return {
        isAuthenticated,
        isLoading,
        isInitialized,
        shouldShowLoader,
        shouldShowContent,
    };
};
