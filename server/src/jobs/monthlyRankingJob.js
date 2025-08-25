const cron = require("node-cron");
const User = require("../models/User");
const MonthlyRanking = require("../models/MonthlyRanking");
const { calculateRankingFromScratch } = require("../services/rankingService");

// Run on 1st of every month at 2 AM
const monthlyRankingJob = cron.schedule(
    "0 2 1 * *",
    async () => {
        console.log("Starting monthly ranking finalization...");

        try {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            await finalizeMonthlyRanking(
                lastMonth.getFullYear(),
                lastMonth.getMonth() + 1
            );

            console.log(
                `Monthly ranking finalized for ${lastMonth.getFullYear()}-${
                    lastMonth.getMonth() + 1
                }`
            );
        } catch (error) {
            console.error("Monthly ranking job failed:", error);
        }
    },
    {
        scheduled: false, // Don't start immediately
    }
);

async function finalizeMonthlyRanking(year, month) {
    // Check if already finalized
    const existing = await MonthlyRanking.findOne({ year, month });
    if (existing?.isFinalized) {
        console.log(`Rankings for ${year}-${month} already finalized`);
        return;
    }

    // Calculate full rankings
    const rankings = await calculateRankingFromScratch(year, month);

    // Add rank numbers
    const rankedUsers = rankings.map((user, index) => ({
        userId: user._id,
        username: user.username,
        monthlyXP: user.monthlyXP,
        rank: index + 1,
    }));

    // Save to cache collection
    await MonthlyRanking.findOneAndUpdate(
        { year, month },
        {
            year,
            month,
            rankings: rankedUsers,
            isFinalized: true,
            lastUpdated: new Date(),
        },
        { upsert: true }
    );
}

module.exports = { monthlyRankingJob, finalizeMonthlyRanking };
