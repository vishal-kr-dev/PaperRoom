import HistoryModel from "../models/HistorySchema.js";
import UserModel from "../models/UserSchema.js";

const createHistoryEntry = async (req, res) => {
  try {
    const { username, tag } = req.body;
    console.log(`Data from frontend User: ${username}, Tag: ${tag}`);

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Check if the user already has a record for today
    let history = await HistoryModel.findOne({
      user: username,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (history) {
      await HistoryModel.updateOne(
        { _id: history._id },
        { $addToSet: { tag: { $each: tag } } }
      );
    } else {
      await HistoryModel.create({
        user: username,
        tag: tag,
      });
    }
    res.status(200).json({ msg: "Submitted successfully" });
  } catch (error) {
    console.log("Error while creating history entry: " + error.message);
    res.status(500).json({
      error: "Error while creating history entry: " + error.message,
    });
  }
};

const getHistoryEntries = async (req, res) => {
  try {
    const { userId } = req.params;

    const historyEntries = await HistoryModel.find({ user: userId })
      .select("user tag createdAt -_id")
      .sort({
        createdAt: -1,
      });

    if (historyEntries.length === 0) {
      return res.status(404).json({ message: "No history entries found" });
    }

    // console.log("Fetched history entries:", historyEntries);
    res.status(200).json({
      message: "History entries fetched successfully",
      historyEntries,
    });
  } catch (error) {
    console.log("Error while fetching history entries: " + error.message);
    res.status(500).json({
      error: "Error while fetching history entries: " + error.message,
    });
  }
};

export { createHistoryEntry, getHistoryEntries };
