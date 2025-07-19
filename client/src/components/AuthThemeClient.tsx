"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { checkAuthStatus } from "@/lib/authCheck";
import { useUIStore } from "@/stores/uiStore";

export default function AuthThemeClient() {
    const { isInitialized, setInitialized, setLoading } = useAuthStore();
    const theme = useUIStore((state) => state.theme);

    // Handle Auth on first load
    useEffect(() => {
        if (!isInitialized) {
            const initAuth = async () => {
                setLoading(true);
                await checkAuthStatus();
                setInitialized(true);
                setLoading(false);
            };
            initAuth();
        }
    }, [isInitialized, setInitialized, setLoading]);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    // useEffect(() => {
    //     const systemDark = window.matchMedia(
    //         "(prefers-color-scheme: dark)"
    //     ).matches;

    //     if (!theme) {
    //         // Optional: Set theme initially based on system preference
    //         setTheme(systemDark ? "dark" : "light");
    //     }

    //     // Apply class to <html>
    //     if (theme === "dark") {
    //         document.documentElement.classList.add("dark");
    //     } else {
    //         document.documentElement.classList.remove("dark");
    //     }
    // }, [theme]);

    return null;
}
