"use client";

import { useState } from "react";
import {
    Users,
    Lock,
    Globe,
    Copy,
    Settings,
    UserPlus,
    Crown,
    Tag,
    MoreHorizontal,
    Shield,
    Clock,
    Link2,
    Download,
    BarChart3,
    LogOut,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    Eye,
    EyeOff,
    // Edit3,
    Trash2,
} from "lucide-react";
import { InviteTokens, Room } from "@/types/room";
import { useRoomStore } from "@/stores/roomStore";

export default function RoomDetailsPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
    const [showTokens, setShowTokens] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const room = useRoomStore((s) => s.room) as Room | null;

    const copyToClipboard = async (
        text: string,
        type: string
    ): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const formatDate = (date: string | number | Date): string => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const getRelativeTime = (date: string | number | Date): string => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const isTokenExpired = (token: InviteTokens): boolean => {
        if (!token.expiresAt) return false;
        return new Date() > new Date(token.expiresAt);
    };

    const getMembershipProgress = () => {
        if (!room) return { current: 0, percentage: 0 };
        const current = room.members?.length ?? 0;
        const max = room.maxMembers ?? 1;
        const percentage = max > 0 ? (current / max) * 100 : 0;
        return { current, percentage };
    };

    const generateNewToken = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In real app, you would add the new token to the room's inviteTokens
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto lg:px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Room Header */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                                <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                                    <div className="p-3 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-800 rounded-xl shadow-md">
                                        {room?.privacy === "private" ? (
                                            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                                            {room?.roomName}
                                        </h1>
                                        <div className="flex items-center space-x-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border border-green-200/50 dark:border-green-700/50 shadow-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                                                {room?.privacy} Room
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    room?.roomCode || "",
                                                    "roomCode"
                                                )
                                            }
                                            className="group flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                                        >
                                            <span className="text-sm font-mono font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                                                {room?.roomCode}
                                            </span>
                                            <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </button>
                                        {copied === "roomCode" && (
                                            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 animate-in fade-in duration-300">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="text-sm font-semibold">
                                                    Copied!
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* <div className="flex items-center space-x-1">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105">
                                            <Edit3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105">
                                            <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {room?.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {room?.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                                    >
                                        <Tag className="h-3 w-3 mr-1.5" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Members Section */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                        Members
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {getMembershipProgress().current} of{" "}
                                        {room?.maxMembers} members
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span className="font-semibold">
                                        Invite Members
                                    </span>
                                </button>
                            </div>

                            {/* Membership Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <span className="font-medium">
                                        Room Capacity
                                    </span>
                                    <span className="font-semibold">
                                        {getMembershipProgress().percentage.toFixed(
                                            0
                                        )}
                                        % filled
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-700 shadow-sm"
                                        style={{
                                            width: `${
                                                getMembershipProgress()
                                                    .percentage
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Room Owner */}
                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-200/50 dark:border-yellow-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="relative">
                                        <img
                                            src={
                                                room?.ownerId.avatar ||
                                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${room?.ownerId.username}`
                                            }
                                            alt={room?.ownerId.username}
                                            className="h-10 w-10 rounded-full ring-3 ring-yellow-300 dark:ring-yellow-600 shadow-md"
                                        />
                                        <div className="absolute -top-0.5 -right-0.5 p-0.5 bg-yellow-400 dark:bg-yellow-500 rounded-full shadow-lg">
                                            <Crown className="h-3 w-3 text-yellow-800 dark:text-yellow-900" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="font-bold text-gray-900 dark:text-gray-100">
                                                {room?.ownerId.username}
                                            </p>
                                            <span className="text-xs bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-800 dark:to-amber-800 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                                                Owner
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                            {room?.ownerId.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Regular Members */}
                                {room?.members
                                .filter((member)=> member._id !== room?.ownerId._id)
                                .map((member) => (
                                    <div
                                        key={member._id}
                                        className="flex items-center space-x-4 p-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50"
                                    >
                                        <div className="relative">
                                            <img
                                                src={
                                                    member.avatar ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`
                                                }
                                                alt={member.username}
                                                className="h-10 w-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-300 dark:group-hover:ring-blue-500 transition-all duration-200 shadow-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                                                {member.username}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                {member.email}
                                            </p>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200">
                                            <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Room Stats */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                    Room Analytics
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg shadow-sm">
                                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                Total Members
                                            </span>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {room?.members.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg shadow-sm">
                                                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                                Created
                                            </span>
                                        </div>
                                        <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                                            {room?.createdAt ? getRelativeTime(room.createdAt) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        {
                                            icon: Link2,
                                            text: "Share Room Link",
                                            color: "blue",
                                        },
                                        {
                                            icon: Download,
                                            text: "Download Member List",
                                            color: "green",
                                        },
                                        {
                                            icon: BarChart3,
                                            text: "Room Analytics",
                                            color: "purple",
                                        },
                                        {
                                            icon: Settings,
                                            text: "Room Settings",
                                            color: "gray",
                                        },
                                    ].map((action, index) => (
                                        <button
                                            key={index}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 rounded-lg transition-all duration-200 group hover:scale-105 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50"
                                        >
                                            <action.icon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                            <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors text-sm">
                                                {action.text}
                                            </span>
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group hover:scale-105 border border-transparent hover:border-red-200/50 dark:hover:border-red-700/50">
                                            <LogOut className="h-4 w-4" />
                                            <span className="text-sm">
                                                Leave Room
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Invite Management */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                                        Invite Tokens
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowTokens(!showTokens)
                                        }
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                                    >
                                        {showTokens ? (
                                            <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {room?.inviteTokens.map((token, index) => {
                                        const expired = isTokenExpired(token);
                                        return (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border-2 transition-all ${
                                                    expired
                                                        ? "bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                                                        : "bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-1.5">
                                                        {expired ? (
                                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        )}
                                                        <span
                                                            className={`text-xs font-bold ${
                                                                expired
                                                                    ? "text-red-600 dark:text-red-400"
                                                                    : "text-green-600 dark:text-green-400"
                                                            }`}
                                                        >
                                                            {expired
                                                                ? "Expired"
                                                                : "Active"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {!expired && (
                                                            <button
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        token.token,
                                                                        `token-${index}`
                                                                    )
                                                                }
                                                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                                            >
                                                                <Copy className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                                            </button>
                                                        )}
                                                        <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors">
                                                            <Trash2 className="h-3 w-3 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {showTokens && (
                                                    <p className="text-xs font-mono text-gray-600 dark:text-gray-300 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border break-all">
                                                        {token.token}
                                                    </p>
                                                )}

                                                <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-semibold">
                                                            Created:
                                                        </span>{" "}
                                                        {formatDate(
                                                            token.createdAt
                                                        )}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">
                                                            {token.expiresAt
                                                                ? "Expires:"
                                                                : "Status:"}
                                                        </span>{" "}
                                                        {token.expiresAt
                                                            ? formatDate(
                                                                  token.expiresAt
                                                              )
                                                            : "Never expires"}
                                                    </p>
                                                </div>

                                                {copied ===
                                                    `token-${index}` && (
                                                    <div className="flex items-center space-x-1.5 text-green-600 dark:text-green-400 mt-2 animate-in fade-in duration-300">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span className="text-xs font-semibold">
                                                            Copied to clipboard!
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <button
                                        onClick={generateNewToken}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span className="font-semibold">
                                            {isLoading
                                                ? "Generating..."
                                                : "Generate New Token"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full animate-in zoom-in duration-300 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Invite Members
                            </h3>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Share this room code with people you want to
                                invite:
                            </p>
                            <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                                <span className="flex-1 font-mono text-lg text-center text-gray-900 dark:text-gray-100">
                                    {room?.roomCode}
                                </span>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            room?.roomCode || "",
                                            "modalCode"
                                        )
                                    }
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                            {copied === "modalCode" && (
                                <div className="text-center text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                                    ✓ Copied to clipboard!
                                </div>
                            )}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Share Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
