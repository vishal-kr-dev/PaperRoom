export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    xp: number;
    subtasks: Subtask[];
    tag: string;
    priority: "low" | "medium" | "high" | "urgent";
    dailyTask: boolean;
    deadline: string | null;
    completedBy: string[];
    createdBy: string;
    roomId: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
