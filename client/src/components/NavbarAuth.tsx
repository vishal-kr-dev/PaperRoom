"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

const NavbarAuth = () => {
    const router = useRouter();
    const { theme, setTheme } = useUIStore();
    const isDarkMode = theme === "dark";

    return (
        <nav className="fixed z-50 top-0 left-0 right-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="w-full max-w-none px-6 flex items-center justify-between h-16">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <Image src="/pr.png" alt="PR" width={32} height={32} />
                    <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        PaperRoom
                    </span>
                </div>
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
            </div>
        </nav>
    );
};

export default NavbarAuth;
