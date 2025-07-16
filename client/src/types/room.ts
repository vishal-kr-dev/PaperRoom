export interface Member {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface Room {
    roomCode: string;
    roomName: string;
    description: string;
    ownerId: string;
    members: Member[];
    maxMembers: number;
    tags: string[];
    privacy: "public" | "private";
    createdAt: string;
}
