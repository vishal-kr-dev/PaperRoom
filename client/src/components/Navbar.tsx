"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Menu, X, LogOut, User, Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { user, isAuthenticated, logout } = useAuthStore();

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    const getNavItems = () => {
        if (pathname === "/") {
            return [
                { name: "Features", href: "#features" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Rooms", href: "#rooms" },
            ];
        }

        return [];
    };

    const navItems = getNavItems();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const handleLogoClick = () => {
        router.push("/");
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", JSON.stringify(newMode));

        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    useEffect(() => {
        // Check for saved dark mode preference
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode) {
            const isDark = JSON.parse(savedMode);
            setIsDarkMode(isDark);
            if (isDark) {
                document.documentElement.classList.add("dark");
            }
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed z-50 top-0 left-0 right-0 w-full transition-all duration-300 border-b ${
                isScrolled
                    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
                    : "bg-transparent"
            }`}
        >
            <div className="w-full max-w-none px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo - Always visible and clickable */}
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                                PR
                            </span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            PaperRoom
                        </span>
                    </div>

                    {/* Desktop Center Nav - Only show if there are nav items (home page only) */}
                    {navItems.length > 0 && (
                        <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Desktop Right Side - Dark Mode Toggle + Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleDarkMode}
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Auth Buttons - Show for non-auth pages when not authenticated */}
                        {!isAuthPage && !isAuthenticated && (
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                                    onClick={() => router.push("/login")}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => router.push("/signup")}
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* User Menu - Show when authenticated */}
                        {!isAuthPage && isAuthenticated && (
                            <div className="flex items-center space-x-3">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Welcome,{" "}
                                    <span className="font-medium">
                                        {user?.username || "User"}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden flex items-center space-x-2">
                        {/* Mobile Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleDarkMode}
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Show menu button only if there's content to show */}
                        {(navItems.length > 0 ||
                            (!isAuthPage && !isAuthenticated) ||
                            (!isAuthPage && isAuthenticated)) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="px-6 py-6 space-y-4">
                            {/* Mobile Nav Items - Only on home page */}
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2 transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}

                            {/* Mobile Auth Buttons - Show when not authenticated and not on auth page */}
                            {!isAuthPage && !isAuthenticated && (
                                <div
                                    className={`${
                                        navItems.length > 0
                                            ? "pt-4 border-t border-gray-200 dark:border-gray-700"
                                            : ""
                                    } space-y-3`}
                                >
                                    <Button
                                        variant="ghost"
                                        className="w-full text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                                        onClick={() => {
                                            router.push("/login");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                        onClick={() => {
                                            router.push("/signup");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Mobile User Menu - Show when authenticated */}
                            {!isAuthPage && isAuthenticated && (
                                <div
                                    className={`${
                                        navItems.length > 0
                                            ? "pt-4 border-t border-gray-200 dark:border-gray-700"
                                            : ""
                                    } space-y-3`}
                                >
                                    <div className="text-sm text-gray-700 dark:text-gray-300 py-2">
                                        Welcome,{" "}
                                        <span className="font-medium">
                                            {user?.username || "User"}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium justify-start"
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
