"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/Sidebar";
import NavbarProtected from "@/components/NavbarProtected";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
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
                <main className="flex-1 lg:ml-64 pt-20 p-6 min-h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
