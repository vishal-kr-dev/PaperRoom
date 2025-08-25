import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { sendResponse } from "../utils/sendResponse.js";
import { DailyStats } from "../models/DailyStats.model.js";
import { MonthlyRankings } from "../models/MonthlyRanking.model.js";

const getChartData = asyncHandler(async (req, res) => {
    const roomId = req.user.roomId;

    if (!roomId) {
        throw new APIerror(400, "Room ID not found");
    }

    const now = new Date();
    const beginningDate = new Date();
    beginningDate.setDate(now.getDate() - 6);
    beginningDate.setHours(18, 30, 0, 0);

    const chartData = await DailyStats.aggregate([
        {
            $match: {
                roomId,
                date: { $gte: beginningDate },
                userId: { $exists: true, $ne: null },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    },
                    username: "$user.username",
                },
                totalXP: { $sum: "$xp" },
            },
        },
        {
            $group: {
                _id: "$_id.date",
                users: {
                    $push: {
                        username: "$_id.username",
                        xp: "$totalXP",
                    },
                },
            },
        },
        {
            $project: {
                date: "$_id",
                users: 1,
                _id: 0,
            },
        },
        { $sort: { date: 1 } },
    ]);

    const past7Days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() - 6 + i);
        const isoDate = d.toISOString().split("T")[0];
        past7Days.push(isoDate);
    }

    const dataMap = new Map();
    chartData.forEach((entry) => dataMap.set(entry.date, entry.users));

    const allUsernames = new Set();
    chartData.forEach((entry) => {
        entry.users.forEach((u) => allUsernames.add(u.username));
    });

    const formattedData = past7Days.map((date) => {
        const dayData = { date };
        const users = dataMap.get(date) || [];

        allUsernames.forEach((username) => {
            const userData = users.find((u) => u.username === username);
            dayData[username] = userData ? userData.xp : 0;
        });

        return dayData;
    });

    return sendResponse(
        res,
        200,
        formattedData,
        "Chart data retrieved successfully"
    );
});

const getRanking = asyncHandler(async (req, res) => {
    const { year, month } = req.params;
    const { roomId } = req.user;

    let rankings = await getMonthlyRanking(
        parseInt(year),
        parseInt(month),
        roomId
    );

    if (!rankings) {
        return sendResponse(res, 204, [], "No ranking found");
    }

    // Get available months data
    const availableMonths = await getAvailableMonths(roomId);

    async function getMonthlyRanking(year, month, roomId) {

        const currentDate = new Date();
        const isCurrentMonth =
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth() + 1;

        // For past months, check pre-calculated data
        if (!isCurrentMonth) {
            const cached = await MonthlyRankings.findOne({
                year,
                month,
                isFinalized: true,
            });

            if (cached) {
                return cached.rankings;
            }
        }

        // Calculate if not present in db
        const calculatedRankings = await calculateRankingFromScratch(
            year,
            month,
            roomId
        );

        // Store the calculated data for past months (finalized data)
        if (
            !isCurrentMonth &&
            calculatedRankings &&
            calculatedRankings.length > 0
        ) {
            try {
                await MonthlyRankings.findOneAndUpdate(
                    { year, month },
                    {
                        year,
                        month,
                        rankings: calculatedRankings,
                        isFinalized: true,
                        calculatedAt: new Date(),
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                );

            } catch (error) {
                console.error(
                    `Error storing rankings for ${year}-${month}:`,
                    error
                );
            }
        }

        return calculatedRankings;
    }

    async function calculateRankingFromScratch(year, month, roomId = null) {

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        let matchCondition = {
            date: { $gte: startDate, $lt: endDate },
        };

        if (roomId) {
            matchCondition.roomId = roomId;
        }

        const result = await DailyStats.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$userId",
                    monthlyXP: { $sum: "$xp" },
                    roomId: { $first: "$roomId" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    userId: "$_id",
                    username: { $arrayElemAt: ["$user.username", 0] },
                    roomId: 1,
                    monthlyXP: 1,
                },
            },
            { $sort: { monthlyXP: -1 } },
        ]);

        return result;
    }

    async function getAvailableMonths(roomId = null) {
        let matchCondition = {};
        if (roomId) {
            matchCondition.roomId = roomId;
        }

        // Get available months from DailyStats
        const availableFromStats = await DailyStats.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                },
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    _id: 0,
                },
            },
            { $sort: { year: -1, month: -1 } },
        ]);

        // Get available months from MonthlyRankings (finalized data)
        let monthlyRankingsMatch = { isFinalized: true };
        if (roomId) {
            monthlyRankingsMatch = {
                ...monthlyRankingsMatch,
                roomId: roomId,
            };
        }

        const availableFromRankings = await MonthlyRankings.aggregate([
            { $match: monthlyRankingsMatch },
            {
                $project: {
                    year: 1,
                    month: 1,
                    _id: 0,
                },
            },
            { $sort: { year: -1, month: -1 } },
        ]);

        // Combine and deduplicate
        const allMonths = [...availableFromStats, ...availableFromRankings];
        const uniqueMonths = allMonths.reduce((acc, current) => {
            const exists = acc.find(
                (item) =>
                    item.year === current.year && item.month === current.month
            );
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Sort by year and month (most recent first)
        uniqueMonths.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });

        return uniqueMonths;
    }

    const responseData = {
        rankings,
        availableMonths,
        currentYear: parseInt(year),
        currentMonth: parseInt(month),
    };

    return sendResponse(res, 200, responseData, "Ranking fetched successfully");
});

export { getChartData, getRanking };
