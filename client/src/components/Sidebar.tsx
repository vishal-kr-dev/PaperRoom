"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/tasks", label: "Tasks", icon: "📝" },
        { href: "/analytics", label: "Analytics", icon: "📈" },
        { href: "/members", label: "Members", icon: "👥" },
        { href: "/notifications", label: "Notifications", icon: "🔔" },
        { href: "/profile", label: "Profile", icon: "👤" },
        { href: "/settings", label: "Settings", icon: "⚙️" },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`fixed z-40 top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl transform duration-300 ease-in-out transition-all flex flex-col ${
                    isSidebarOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-full opacity-0"
                } lg:translate-x-0 lg:opacity-100`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Menu
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <span className="text-gray-500 dark:text-gray-400 text-xl">
                            &times;
                        </span>
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 transition-all group"
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={user?.avatar}
                                alt={user?.username}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {user?.username?.[0]?.toUpperCase() || "G"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {user?.username || "Guest User"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email || "No email"}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-sm text-amber-50 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition bg-red-500/90 dark:bg-red-500/80"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
