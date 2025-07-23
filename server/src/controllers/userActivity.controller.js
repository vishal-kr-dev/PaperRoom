import { UserActivity } from "../models/UserActivity.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { sendResponse } from "../utils/sendResponse.js";

const getUserActivities = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        action,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query;

    const roomId = req.user.roomId;


    if (!roomId) {
        throw new APIerror(404, "Room id not found");
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query object
    const query = {};
    if (roomId) query.roomId = roomId;
    if (action) query.action = action;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const [activities, total] = await Promise.all([
        UserActivity.find(query)
            .populate("userId", "username email avatar")
            .populate("taskId", "title description status")
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)
            .lean(),
        UserActivity.countDocuments(query),
    ]);

    if (!activities || activities.length === 0) {
        return sendResponse(res, 404, [], "No user activities found");
    }
    
    const totalPages = Math.ceil(total / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    const data = {
        activities,
        pagination: {
            currentPage: pageNumber,
            totalPages,
            totalItems: total,
            itemsPerPage: limitNumber,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? pageNumber + 1 : null,
            prevPage: hasPrevPage ? pageNumber - 1 : null,
        },
    };

    return sendResponse(res, 200, data, "User activities fetched successfully");
});

const getUserActivityStats = asyncHandler(async (req, res) => {
    const { timeframe = "7d" } = req.query;
    const roomId = req.user.roomId;

    if (!roomId) {
        throw new APIerror(404, "Room id not found");
    }

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;

    switch (timeframe) {
        case "1d":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const query = {
        createdAt: { $gte: startDate },
    };

    if (roomId) query.roomId = roomId;

    const stats = await UserActivity.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$action",
                count: { $sum: 1 },
                totalXP: { $sum: "$taskSnapshot.xp" },
            },
        },
        {
            $group: {
                _id: null,
                actionCounts: {
                    $push: {
                        action: "$_id",
                        count: "$count",
                        totalXP: "$totalXP",
                    },
                },
                totalActivities: { $sum: "$count" },
                totalXPEarned: { $sum: "$totalXP" },
            },
        },
    ]);

    const data = stats[0] || {
        actionCounts: [],
        totalActivities: 0,
        totalXPEarned: 0,
    };

    return sendResponse(
        res,
        200,
        data,
        "User activity stats fetched successfully"
    );
});

export { getUserActivities, getUserActivityStats };
