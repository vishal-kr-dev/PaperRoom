export interface Task {
    _id: string;
    title: string;
    description: string;
    tag: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "done";
    points: number;
    subtasks: string[];
    deadline: string | null;
    dailyTask: boolean;
    completedBy: string[];
    createdBy: string;
    roomId: string;
    createdAt: string;
    updatedAt: string;
}
