export const calculateCompletionBonus = (
    task,
    completionDate,
    userStats = {}
) => {
    let bonusPoints = 0;
    const completion = new Date(completionDate);
    const today = new Date();

    // Streak Bonus
    const currentStreak = userStats.currentStreak || 0;
    let streakBonus = 0;

    if (currentStreak >= 30) streakBonus = 50;
    else if (currentStreak >= 21) streakBonus = 35;
    else if (currentStreak >= 14) streakBonus = 25;
    else if (currentStreak >= 7) streakBonus = 15;
    else if (currentStreak >= 3) streakBonus = 5;

    // Early Completion Bonus (only for tasks with deadlines)
    let earlyCompletionBonus = 0;
    let deadlinePenalty = 0;

    if (task.deadline && !task.dailyTask) {
        const deadlineDate = new Date(task.deadline);
        const daysBeforeDeadline = Math.ceil(
            (deadlineDate.getTime() - completion.getTime()) /
                (1000 * 60 * 60 * 24)
        );

        if (daysBeforeDeadline > 0) {
            // Completed early
            if (daysBeforeDeadline >= 7) earlyCompletionBonus = 25;
            else if (daysBeforeDeadline >= 3) earlyCompletionBonus = 15;
            else if (daysBeforeDeadline >= 1) earlyCompletionBonus = 10;
            else earlyCompletionBonus = 5;
        } else if (daysBeforeDeadline < 0) {
            // Completed late
            const daysLate = Math.abs(daysBeforeDeadline);
            if (daysLate >= 7) deadlinePenalty = -30;
            else if (daysLate >= 3) deadlinePenalty = -20;
            else if (daysLate >= 1) deadlinePenalty = -10;
            else deadlinePenalty = -5;
        }
    }

    // Priority Completion Bonus
    const priorityCompletionBonus = {
        low: 2,
        medium: 5,
        high: 10,
        urgent: 15,
    };
    const priorityBonus = priorityCompletionBonus[task.priority] || 5;

    // Calculate total bonus
    bonusPoints =
        streakBonus +
        earlyCompletionBonus +
        priorityBonus +
        deadlinePenalty;

    // Apply multiplier for high-priority tasks
    if (task.priority === "urgent") {
        bonusPoints = Math.round(bonusPoints * 1.2);
    } else if (task.priority === "high") {
        bonusPoints = Math.round(bonusPoints * 1.1);
    }

    return {
        totalBonus: Math.max(bonusPoints, -15),
        breakdown: {
            streakBonus,
            earlyCompletionBonus,
            dailyTaskBonus,
            priorityBonus,
            perfectWeekBonus,
            quickCompletionBonus,
            deadlinePenalty,
        },
    };
};

// Helper function to update user stats after task completion
export const updateUserStats = (
    currentStats,
    task,
    completionDate,
    wasCompletedToday
) => {
    const stats = { ...currentStats };
    const completion = new Date(completionDate);
    const today = new Date();

    // Update streak
    if (wasCompletedToday) {
        stats.currentStreak = (stats.currentStreak || 0) + 1;
        stats.longestStreak = Math.max(
            stats.longestStreak || 0,
            stats.currentStreak
        );
    } else {
        // Check if completion breaks the streak
        const daysSinceCompletion = Math.ceil(
            (today.getTime() - completion.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceCompletion > 1) {
            stats.currentStreak = 0;
        }
    }

    // Update perfect week status
    stats.tasksCompletedThisWeek = (stats.tasksCompletedThisWeek || 0) + 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Simple check - if they've completed 7+ tasks this week, they get perfect week
    stats.perfectWeek = stats.tasksCompletedThisWeek >= 7;

    // Update total completed tasks
    stats.totalCompletedTasks = (stats.totalCompletedTasks || 0) + 1;

    return stats;
};

// Usage example:
// const task = {
//     title: "Complete project proposal",
//     priority: "high",
//     deadline: "2024-12-31",
//     dailyTask: false,
//     createdAt: "2024-12-20T10:00:00Z"
// };

// const userStats = {
//     currentStreak: 5,
//     longestStreak: 10,
//     totalCompletedTasks: 50,
//     tasksCompletedThisWeek: 3,
//     perfectWeek: false
// };

// const completionDate = "2024-12-25T15:30:00Z";
// const bonus = calculateCompletionBonus(task, completionDate, userStats);
// console.log(bonus);
