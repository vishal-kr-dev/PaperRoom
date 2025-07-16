"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/Sidebar";
import NavbarProtected from "@/components/NavbarProtected";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppInitializer from "@/components/AppInitializer";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
    const user = useAuthStore(state => state.user)
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isInitialized, router]);

    useEffect(() => {
        if (user && !user.roomId) {
            router.push("/join");
        }
    }, [user, router]);

    if (!isInitialized || isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavbarProtected />
            <div className="flex">
                <Sidebar />
                <AppInitializer />
                <main className="flex-1 lg:ml-64 pt-20 p-6 min-h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
