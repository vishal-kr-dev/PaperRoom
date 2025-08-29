import { create } from "zustand";
import { Task } from "@/types/task";
import axiosInstance from "@/lib/axiosInstance";
import { extractErrorMessage } from "@/utils/errorUtils";

interface TaskLoadingState {
    isToggling?: boolean;
    isDeleting?: boolean;
    isEditing?: boolean;
}

interface TaskStore {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    taskLoadingStates: Record<string, TaskLoadingState>; // New: per-task loading states

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updated: Partial<Task>) => void;
    removeTask: (id: string) => void;
    clearTasks: () => void;

    // Loading state management
    setTaskLoading: (
        taskId: string,
        loadingType: keyof TaskLoadingState,
        isLoading: boolean
    ) => void;
    getTaskLoadingState: (taskId: string) => TaskLoadingState;
    clearTaskLoading: (taskId: string) => void;

    fetchTasks: () => Promise<void>;
    createTaskAsync: (task: Omit<Task, "_id">) => Promise<Task | null>;
    updateTaskAsync: (task: Task, id: string) => Promise<void>;
    deleteTaskAsync: (id: string) => Promise<void>;
    markCompleteAsync: (id: string) => Promise<void>;
    markPendingAsync: (id: string) => Promise<void>;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    // Initial state
    tasks: [],
    isLoading: false,
    error: null,
    taskLoadingStates: {},

    // Basic state setters
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updated) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t._id === id ? { ...t, ...updated } : t
            ),
        })),
    removeTask: (id) =>
        set((state) => {
            // Clean up loading state when task is removed
            const newLoadingStates = { ...state.taskLoadingStates };
            delete newLoadingStates[id];
            return {
                tasks: state.tasks.filter((t) => t._id !== id),
                taskLoadingStates: newLoadingStates,
            };
        }),
    clearTasks: () => set({ tasks: [], taskLoadingStates: {} }),

    // Loading state management
    setTaskLoading: (taskId, loadingType, isLoading) =>
        set((state) => ({
            taskLoadingStates: {
                ...state.taskLoadingStates,
                [taskId]: {
                    ...state.taskLoadingStates[taskId],
                    [loadingType]: isLoading,
                },
            },
        })),

    getTaskLoadingState: (taskId) => {
        const { taskLoadingStates } = get();
        return taskLoadingStates[taskId] || {};
    },

    clearTaskLoading: (taskId) =>
        set((state) => {
            const newLoadingStates = { ...state.taskLoadingStates };
            delete newLoadingStates[taskId];
            return { taskLoadingStates: newLoadingStates };
        }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchTasks: async () => {
        const { setLoading, setError, setTasks } = get();

        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosInstance.get("/tasks");
            setTasks(data.data);
        } catch (error: unknown) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to fetch tasks";
            setError(errorMessage);
            console.error("Error fetching tasks:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    },

    createTaskAsync: async (taskData) => {
        const { setError, addTask } = get();

        try {
            setError(null);

            const { data } = await axiosInstance.post("/tasks", taskData);
            addTask(data.data);
            return data.data;
        } catch (error) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to create task";
            setError(errorMessage);
            console.error("Error creating task:", error);
            throw error;
        }
    },

    updateTaskAsync: async (task, id) => {
        const { setError, updateTask, setTaskLoading } = get();

        try {
            setTaskLoading(task._id, "isEditing", true);
            setError(null);
            console.log("updated", task);

            const { data } = await axiosInstance.put(`/tasks/${id}`, task);
            updateTask(task._id, data.data);
        } catch (error) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to update task";
            setError(errorMessage);
            console.error("Error updating task:", error);
            throw error;
        } finally {
            setTaskLoading(task._id, "isEditing", false);
        }
    },

    deleteTaskAsync: async (id) => {
        const { setError, removeTask, setTaskLoading } = get();

        try {
            setTaskLoading(id, "isDeleting", true);
            setError(null);

            await axiosInstance.delete(`/tasks/${id}`);
            removeTask(id);
        } catch (error) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to delete task";
            setError(errorMessage);
            console.error("Error deleting task:", error);
            setTaskLoading(id, "isDeleting", false);
            throw error;
        }
    },

    markCompleteAsync: async (id) => {
        const { setError, updateTask, setTaskLoading } = get();

        try {
            setTaskLoading(id, "isToggling", true);
            setError(null);

            const { data } = await axiosInstance.patch(`/tasks/${id}/complete`);
            updateTask(id, { isCompleted: true, ...data.data });
        } catch (error) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to mark task as complete";
            setError(errorMessage);
            console.error("Error marking task complete:", error);
            throw error;
        } finally {
            setTaskLoading(id, "isToggling", false);
        }
    },

    markPendingAsync: async (id) => {
        const { setError, updateTask, setTaskLoading } = get();

        try {
            setTaskLoading(id, "isToggling", true);
            setError(null);

            const { data } = await axiosInstance.patch(`/tasks/${id}/pending`);
            updateTask(id, { isCompleted: false, ...data.data });
        } catch (error) {
            const errorMessage =
                extractErrorMessage(error) || "Failed to mark task as pending";
            setError(errorMessage);
            console.error("Error marking task pending:", error);
            throw error;
        } finally {
            setTaskLoading(id, "isToggling", false);
        }
    },
}));
