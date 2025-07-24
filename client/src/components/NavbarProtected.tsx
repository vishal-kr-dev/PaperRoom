"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "./ui/button";
import { Moon, Sun, Menu, X, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { UserAvatar } from "./UserAvatara";

const NavbarProtected = () => {
    const router = useRouter();
    const { theme, setTheme, isSidebarOpen, toggleSidebar } = useUIStore();
    const user = useAuthStore((state) => state.user);
    const isDarkMode = theme === "dark";

    return (
        <nav className="fixed z-50 top-0 left-0 right-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="w-full max-w-none px-6 flex items-center justify-between h-16 lg:h-20">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <Image src="/pr.png" alt="PR" width={32} height={32} />
                    <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        PaperRoom
                    </span>
                </div>

                <div className="flex items-center sm:space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="p-2 lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        {isSidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>

                    <UserAvatar username={user?.username} className="hidden lg:block" />
                </div>
            </div>
        </nav>
    );
};

export default NavbarProtected;
