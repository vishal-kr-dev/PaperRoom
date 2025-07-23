export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface InviteTokens {
    token: string;
    createdAt: string | Date;
    expiresAt: string | Date;
}

export interface Room {
    _id: string;
    roomCode: string;
    roomName: string;
    description: string;
    ownerId: User;
    members: User[];
    maxMembers: number;
    tags: string[];
    privacy: "public" | "private";
    inviteTokens: InviteTokens[];
    createdAt: string | Date;
}
