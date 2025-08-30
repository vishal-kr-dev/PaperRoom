"use client";

import React, { useState } from "react";
import { User, Lock, Bell } from "lucide-react";
import { ProfileSettings } from "./_components/ProfileSettings";
import { PasswordSettings } from "./_components/PasswordSettings";
import { NotificationSettings } from "./_components/NotificationsSettings";

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        "profile" | "password" | "notifications"
    >("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "password", label: "Password", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
    ] as const;

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSettings />;
            case "password":
                return <PasswordSettings />;
            case "notifications":
                return <NotificationSettings />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="rounded-lg shadow-sm mb-8 border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Settings
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="rounded-lg shadow-sm p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                                                activeTab === tab.id
                                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-600 dark:text-white"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 mr-3" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            {renderActiveComponent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
