import { z } from "zod";

const registerUserSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .transform((e) => e.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .transform((e) => e.toLowerCase()),
    password: z.string(),
});

export { registerUserSchema, loginUserSchema };