"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Sun, Moon, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useUIStore } from "@/stores/uiStore";
import Image from "next/image";

const homeNavItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Rooms", href: "#rooms" },
];

const NavbarLanding = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useUIStore();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isDarkMode = theme === "dark";

    useEffect(() => {
        setTheme(theme);
    }, [theme, setTheme]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed z-50 top-0 left-0 right-0 w-full transition-all duration-300 border-b ${
                scrolled
                    ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md"
                    : "bg-transparent"
            }`}
        >
            <div className="w-full max-w-none px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <Image src="/pr.png" alt="PR" width={32} height={32} />
                        <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            PaperRoom
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                        {homeNavItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setTheme(isDarkMode ? "light" : "dark")
                            }
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
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                            onClick={() => router.push("/signup")}
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="lg:hidden flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setTheme(isDarkMode ? "light" : "dark")
                            }
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
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t border-gray-200 dark:border-gray-700 py-4 px-6 z-40">
                        <div className="space-y-3">
                            {homeNavItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <Button
                                variant="ghost"
                                className="w-full text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                onClick={() => router.push("/login")}
                            >
                                Sign In
                            </Button>
                            <Button
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                onClick={() => router.push("/signup")}
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavbarLanding;
