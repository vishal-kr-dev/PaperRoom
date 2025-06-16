import { z } from "zod";

const objectIdPattern = /^[a-f\d]{24}$/i;

const ObjectIdSchema = z
    .string()
    .regex(objectIdPattern, { message: "Invalid ObjectId format" });

const baseAvatarUrl =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const createUserSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().email("Invalid email format").trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),

    avatar: z.string().url().optional().default(baseAvatarUrl),
    roomId: ObjectIdSchema.optional().nullable(),

    // Gamification
    experience: z.number().min(0).optional().default(0),
    level: z.number().min(1).optional().default(1),

    // Streaks
    currentStreak: z.number().min(0).optional().default(0),
    streakUpdate: z
        .preprocess((val) => (val ? new Date(val) : new Date()), z.date())
        .optional(),

    // Verification & tokens
    emailVerified: z.boolean().optional().default(false),
    refreshToken: z.string().optional(),
    passwordResetToken: z.string().optional().nullable(),
    passwordResetTokenExpiry: z
        .preprocess((val) => (val ? new Date(val) : null), z.date().nullable())
        .optional(),
});

const updateUserSchema = z.object({
    username: z.string().trim().min(3).max(50).optional(),
    email: z.string().email().trim().optional(),
    password: z.string().min(6).optional(),
    avatar: z.string().url().optional(),
    roomId: ObjectIdSchema.optional().nullable(),

    // Gamification
    experience: z.number().min(0).optional(),
    level: z.number().min(1).optional(),

    // Streaks
    currentStreak: z.number().min(0).optional(),
    streakUpdate: z
        .preprocess(
            (val) => (val ? new Date(val) : undefined),
            z.date().optional()
        )
        .optional(),

    // Verification
    emailVerified: z.boolean().optional(),
    refreshToken: z.string().optional(),
    passwordResetToken: z.string().optional().nullable(),
    passwordResetTokenExpiry: z
        .preprocess((val) => (val ? new Date(val) : null), z.date().nullable())
        .optional(),
});
  

export { createUserSchema, updateUserSchema };