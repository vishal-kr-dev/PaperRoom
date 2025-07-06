import mongoose, { Schema } from "mongoose";

const statsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        xp: {
            type: Number,
            default: 0,
            min: 0,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        currentStreak: {
            type: Number,
            default: 0,
            min: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
            min: 0,
        },
        streakUpdate: {
            type: Date,
            default: Date.now,
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastTaskCompletionDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Method to update streak with transaction support
statsSchema.methods.updateStreak = async function (session = null) {
    const today = new Date();
    const lastUpdate = this.lastTaskCompletionDate || new Date(0);

    const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const lastMidnight = new Date(
        lastUpdate.getFullYear(),
        lastUpdate.getMonth(),
        lastUpdate.getDate()
    );

    const diffInDays = Math.floor(
        (todayMidnight - lastMidnight) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
        // Already updated today - no change needed
        return this;
    } else if (diffInDays === 1) {
        // Consecutive day
        this.currentStreak += 1;
    } else {
        // Streak broken, reset to 1
        this.currentStreak = 1;
    }

    // Update longest streak if current streak is higher
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }

    this.streakUpdate = today;
    this.lastTaskCompletionDate = today;

    // Save with session support
    return await this.save({ session });
};

// Method to add XP and level up
statsSchema.methods.addExperience = function (xpToAdd, userLevel) {
    this.xp += xpToAdd;
    this.level = userLevel; // Sync with user level
    this.tasksCompleted += 1;
    return this;
};

// Method to get streak status
statsSchema.methods.getStreakStatus = function () {
    const today = new Date();
    const lastUpdate = this.lastTaskCompletionDate || new Date(0);

    const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const lastMidnight = new Date(
        lastUpdate.getFullYear(),
        lastUpdate.getMonth(),
        lastUpdate.getDate()
    );

    const diffInDays = Math.floor(
        (todayMidnight - lastMidnight) / (1000 * 60 * 60 * 24)
    );

    return {
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        daysSinceLastTask: diffInDays,
        streakStatus:
            diffInDays === 0
                ? "completed_today"
                : diffInDays === 1
                ? "can_continue"
                : "broken",
    };
};

// Static method to find or create stats for a user
statsSchema.statics.findOrCreateForUser = async function (
    userId,
    session = null
) {
    let stats = await this.findOne({ userId }).session(session);

    if (!stats) {
        stats = new this({ userId });
        await stats.save({ session });
    }

    return stats;
};

export const Stats = mongoose.model("Stats", statsSchema);
