import React, { useEffect, useState } from "react";
import {
    Trophy,
    Users,
    Crown,
    Medal,
    Award,
    ChevronDown,
    Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "../../../../components/UserAvatar";
import axiosInstance from "@/lib/axiosInstance";

interface Users {
    username: string;
    score: number;
    month?: string;
}

interface MembersListProps {
    members?: Users[];
    className?: string;
    isLoading?: boolean;
    availableMonths?: string[];
}

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return (
                <Crown className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            );
        case 2:
            return (
                <Medal className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            );
        case 3:
            return (
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            );
        default:
            return (
                <span className="text-muted-foreground font-semibold text-sm w-5 text-center">
                    #{rank}
                </span>
            );
    }
};

const getRankColors = (rank: number) => {
    switch (rank) {
        case 1:
            return {
                bg: "bg-gradient-to-r from-yellow-50/80 to-amber-50/80 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200/60 dark:border-yellow-800/50",
                text: "text-yellow-900 dark:text-yellow-200",
                glow: "shadow-yellow-100/50 dark:shadow-yellow-900/20",
            };
        case 2:
            return {
                bg: "bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200/60 dark:border-slate-800/50",
                text: "text-slate-900 dark:text-slate-200",
                glow: "shadow-slate-100/50 dark:shadow-slate-900/20",
            };
        case 3:
            return {
                bg: "bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/60 dark:border-amber-800/50",
                text: "text-amber-900 dark:text-amber-200",
                glow: "shadow-amber-100/50 dark:shadow-amber-900/20",
            };
        default:
            return {
                bg: "bg-card/50 dark:bg-card/30 border-border/50 hover:bg-muted/70 dark:hover:bg-muted/40",
                text: "text-foreground",
                glow: "",
            };
    }
};

const Leaderboard: React.FC<MembersListProps> = ({
    members = [
        { username: "AlexTheChampion", score: 2850, month: "2025-01" },
        { username: "SarahProGamer", score: 2640, month: "2025-01" },
        { username: "MikeSpeedster", score: 2580, month: "2025-01" },
        { username: "tom", score: 1920, month: "2025-01" },
        { username: "jerry", score: 1850, month: "2025-01" },
        { username: "EmilyExpert", score: 1780, month: "2025-01" },
        { username: "DavidDragon", score: 1650, month: "2025-01" },
        { username: "LucyLegend", score: 1590, month: "2025-01" },
        // Additional months data
        { username: "AlexTheChampion", score: 2700, month: "2024-12" },
        { username: "tom", score: 2100, month: "2024-12" },
        { username: "SarahProGamer", score: 2000, month: "2024-12" },
        { username: "jerry", score: 1950, month: "2024-12" },
        { username: "MikeSpeedster", score: 1800, month: "2024-12" },
    ],
    availableMonths = ["2025-01", "2024-12", "2024-11", "2024-10"],
    className = "",
    isLoading = false,
}) => {
    const [selectedMonth, setSelectedMonth] = useState(
        availableMonths[0] || "2025-01"
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const current = new Date()
    const year = current.getFullYear()
    const month = current.getMonth()
    console.log( year, month)

    useEffect(() => {
        const temp = async () =>{
            const ranks = await axiosInstance(`/user/rankings/${year}/${month}`);
            console.log("ranks data ", ranks)
        }
        temp();

    }, [])
    

    const showEmpty = !isLoading && members.length === 0;

    // Filter members by selected month and sort
    const filteredMembers = members.filter(
        (member) => !member.month || member.month === selectedMonth
    );

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        if (a.score && b.score) return b.score - a.score;
        return a.username.localeCompare(b.username);
    });

    const formatMonthDisplay = (monthStr: string) => {
        const [year, month] = monthStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div
            className={cn(
                "rounded-xl border border-border/60 bg-card/80 dark:bg-card/40 backdrop-blur-sm shadow-lg dark:shadow-2xl",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center rounded-xl justify-between p-4 border-b border-border/40 bg-gradient-to-r from-background/80 to-muted/30 dark:from-background/60 dark:to-muted/20">
                <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Leaderboard
                    </h3>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Month Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-muted/60 dark:bg-muted/40 hover:bg-muted/80 dark:hover:bg-muted/60 rounded-lg border border-border/40 transition-colors"
                        >
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-foreground font-medium">
                                {formatMonthDisplay(selectedMonth)}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                                    isDropdownOpen && "rotate-180"
                                )}
                            />
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border/60 rounded-lg shadow-lg dark:shadow-xl z-50 py-1">
                                {availableMonths.map((month) => (
                                    <button
                                        key={month}
                                        onClick={() => {
                                            setSelectedMonth(month);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-3 py-2 text-left text-sm hover:bg-muted/60 dark:hover:bg-muted/40 transition-colors",
                                            selectedMonth === month &&
                                                "bg-muted/80 dark:bg-muted/60 text-foreground font-medium"
                                        )}
                                    >
                                        {formatMonthDisplay(month)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={cn("overflow-y-auto p-2")}>
                {isLoading ? (
                    <div className="space-y-2 p-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-3 p-3"
                            >
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-6 w-12" />
                            </div>
                        ))}
                    </div>
                ) : showEmpty ? (
                    <div className="p-8 text-center">
                        <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No rankings available
                        </p>
                        <p className="text-sm text-muted-foreground/80 mt-1">
                            Start competing to see the leaderboard!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <AnimatePresence>
                            {sortedMembers.map((member, index) => {
                                const rank = index + 1;
                                const colors = getRankColors(rank);

                                return (
                                    <motion.div
                                        key={member.username}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                        }}
                                        className={cn(
                                            "relative flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl backdrop-blur-sm",
                                            colors.bg,
                                            colors.glow,
                                            rank <= 3 &&
                                                "ring-1 ring-current/20"
                                        )}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 },
                                        }}
                                    >
                                        {/* Rank Icon/Number */}
                                        <div className="flex items-center justify-center w-8">
                                            {getRankIcon(rank)}
                                        </div>

                                        {/* Avatar */}
                                        <UserAvatar
                                            username={member.username}
                                            size={rank <= 3 ? "md" : "sm"}
                                        />

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={cn(
                                                    "font-medium truncate",
                                                    colors.text,
                                                    rank <= 3 && "font-semibold"
                                                )}
                                            >
                                                {member.username}
                                            </p>
                                            {member.score && (
                                                <p className="text-xs text-muted-foreground/80">
                                                    {member.score.toLocaleString()}{" "}
                                                    pts
                                                </p>
                                            )}
                                        </div>

                                        {/* Top 3 Sparkle Effect */}
                                        {rank <= 3 && (
                                            <motion.div
                                                className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 dark:bg-yellow-300 rounded-full opacity-80"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.6, 1, 0.6],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: rank * 0.3,
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Footer for top performers */}
            {!isLoading && !showEmpty && sortedMembers.length > 0 && (
                <div className="border-t border-border/40 bg-muted/30 dark:bg-muted/20 px-4 py-2">
                    <p className="text-xs text-muted-foreground/90 text-center">
                        🏆 {formatMonthDisplay(selectedMonth)} Champions
                    </p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
