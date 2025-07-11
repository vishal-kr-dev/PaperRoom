import { z } from "zod";

const priorityEnum = z.enum(["low", "medium", "high", "urgent"]);

export const taskSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).trim(),
    description: z
        .string()
        .trim()
        .optional(),
    xp: z.number().min(0, { message: "XP must be a non-negative number" }),
    subtasks: z.array(z.string().trim()).optional(),
    tag: z.string().min(1, { message: "Please select a single tag" }).trim(),
    priority: priorityEnum.default("medium"),
    dailyTask: z.boolean().default(false),
    deadline: z
        .union([z.string().datetime(), z.null()])
        .optional()
        .refine((val) => !val || new Date(val) > new Date(), {
            message: "Deadline must be in the future",
        }),
});


export const createTaskSchema = taskSchema;

export const updateTaskSchema = taskSchema.partial();
