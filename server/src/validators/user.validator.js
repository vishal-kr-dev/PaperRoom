import { z } from "zod";

const baseAvatarUrl =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const registerUserSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .transform((e) => e.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // avatar: z.string().url().optional().default(baseAvatarUrl),
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