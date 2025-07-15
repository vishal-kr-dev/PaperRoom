import React from "react";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Member } from "@/types/room";



interface MembersListProps {
    members?: Member[];
    className?: string;
    maxHeight?: string;
    isLoading?: boolean;
}

const MembersList: React.FC<MembersListProps> = ({
    members = [],
    className = "",
    maxHeight = "h-96",
    isLoading = false,
}) => {
    const showEmpty = !isLoading && members.length === 0;

    return (
        <div
            className={cn(
                "rounded-xl border bg-background shadow-sm",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Members
                    </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                    {isLoading ? "..." : members.length}
                </span>
            </div>

            {/* Content */}
            <div className={cn("overflow-y-auto p-2", maxHeight)}>
                {isLoading ? (
                    <div className="space-y-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-3 p-3"
                            >
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : showEmpty ? (
                    <div className="p-8 text-center">
                        <Users className="h-12 w-12 text-muted mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No members found
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <AnimatePresence>
                            {members.map((member) => (
                                <motion.div
                                    key={member._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center space-x-3 rounded-lg p-3"
                                >
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage
                                            src={member.avatar}
                                            alt={member.username}
                                        />
                                        <AvatarFallback>
                                            {member.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {member.username}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembersList;