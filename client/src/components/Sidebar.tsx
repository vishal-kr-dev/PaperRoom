"use client";

import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/tasks", label: "Tasks", icon: "📝" },
        { href: "/analytics", label: "Analytics", icon: "📈" },
        { href: "/members", label: "Members", icon: "👥" },
        { href: "/notifications", label: "Notifications", icon: "🔔" },
        { href: "/profile", label: "Profile", icon: "👤" },
        { href: "/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar toggle button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-24 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed z-40 top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 overflow-y-auto flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Menu
                    </h2>
                    {/* Close button for mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 group"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="mr-3 text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                                U
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                User Name
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                user@example.com
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
