"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Menu, X, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6">
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

                    {/* Desktop Nav - Only show if there are nav items (home page only) */}
                    {navItems.length > 0 && (
                        <div className="hidden lg:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 relative group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Desktop CTA - Show auth buttons for non-auth pages when not authenticated */}
                    {!isAuthPage && !isAuthenticated && (
                        <div className="hidden lg:flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                className="text-gray-700 hover:text-indigo-600 font-medium"
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
                        </div>
                    )}

                    {/* Desktop User Menu - Show when authenticated */}
                    {!isAuthPage && isAuthenticated && (
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-sm text-gray-700">
                                    Welcome,{" "}
                                    <span className="font-medium">
                                        {user?.username || "User"}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 font-medium"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Icon - Show only for home page nav items or auth buttons */}
                    {(navItems.length > 0 ||
                        (!isAuthPage && !isAuthenticated) ||
                        (!isAuthPage && isAuthenticated)) && (
                        <div className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="text-gray-700 hover:text-indigo-600"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
                        <div className="px-6 py-6 space-y-4">
                            {/* Mobile Nav Items - Only on home page */}
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors duration-200"
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
                                            ? "pt-4 border-t border-gray-200"
                                            : ""
                                    } space-y-3`}
                                >
                                    <Button
                                        variant="ghost"
                                        className="w-full text-gray-700 hover:text-indigo-600 font-medium"
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
                                            ? "pt-4 border-t border-gray-200"
                                            : ""
                                    } space-y-3`}
                                >
                                    <div className="text-sm text-gray-700 py-2">
                                        Welcome,{" "}
                                        <span className="font-medium">
                                            {user?.username || "User"}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-gray-700 hover:text-red-600 font-medium justify-start"
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
