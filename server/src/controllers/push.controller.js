import { PushSubscription } from "../models/PushSubscription.model.js";
import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";

const getPublicKey = asyncHandler(async (req, res) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    return sendResponse(
        res,
        200,
        { publicKey },
        "Public key retrieved successfully"
    );
});

const subscribe = asyncHandler(async (req, res) => {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
        throw new APIerror(400, "Invalid subscription data");
    }

    const data = await PushSubscription.findOneAndUpdate(
        { userId: req.user._id },
        {
            $set: {
                roomId: req.user.roomId,
                subscription,
            },
        },
        {
            upsert: true, 
            new: true,
        }
    );

    return sendResponse(
        res,
        201,
        subscription,
        "Subscription saved successfully"
    );
});

const unsubscribe = asyncHandler(async (req, res) => {
    
    await PushSubscription.deleteOne({ userId: req.user._id });

    return sendResponse(
        res,
        200,
        {},
        "Unsubscribed successfully"
    );
});



export { getPublicKey, subscribe, unsubscribe };
