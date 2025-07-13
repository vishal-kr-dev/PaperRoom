export interface Room {
    roomCode: string;
    roomName: string;
    description: string;
    ownerId: string;
    members: string[];
    maxMembers: number;
    tags: string[];
    privacy: "public" | "private";
    createdAt: string;
}
