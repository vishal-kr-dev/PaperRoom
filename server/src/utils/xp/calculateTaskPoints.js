export const calculateTaskPoints = (task) => {
    let basePoints = 10;

    const priorityMultiplier = {
        low: 1,
        medium: 1.5,
        high: 2,
        urgent: 3,
    };

    // Title and Description Bonus
    const titleBonus = task.title && task.title.length > 30 ? 2 : 0;
    const descriptionBonus =
        task.description && task.description.length > 100 ? 5 : 0;

    // Daily Task Bonus
    const dailyBonus = task.dailyTask ? 15 : 0;

    // Deadline Bonus
    let deadlineBonus = 0;
    if (task.deadline && !task.dailyTask) {
        const deadlineDate = new Date(task.deadline);
        const today = new Date();
        const daysUntilDeadline = Math.ceil(
            (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilDeadline <= 1) deadlineBonus = 20;
        else if (daysUntilDeadline <= 3) deadlineBonus = 15;
        else if (daysUntilDeadline <= 7) deadlineBonus = 10;
        else deadlineBonus = 5;
    }

    // Priority Multiplier
    const multiplier = priorityMultiplier[task.priority] ?? 1.5;

    // Calculate total
    const totalPoints = Math.round(
        (basePoints +
            titleBonus +
            descriptionBonus +
            dailyBonus +
            deadlineBonus) *
            multiplier
    );

    return Math.max(totalPoints, 5);
};
