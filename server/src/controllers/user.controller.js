import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { sendResponse } from "../utils/sendResponse.js";
import { DailyStats } from "../models/DailyStats.model.js";

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

export { getChartData };
