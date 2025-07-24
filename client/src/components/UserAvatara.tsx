// components/UserAvatar.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
    username?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
};

export function UserAvatar({
    username,
    size = "md",
    className = "",
}: UserAvatarProps) {
    const seed = username || "default";
    const initials = username?.charAt(0).toUpperCase() || "?";

    return (
        <Avatar className={`${sizeMap[size]} border ${className}`}>
            <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                alt={username || "User avatar"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
