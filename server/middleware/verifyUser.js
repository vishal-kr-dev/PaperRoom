import jwt, { decode } from "jsonwebtoken";
import UserModel from "../models/UserSchema.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const user = await UserModel.findOne({ username: decoded.username })
    .select(
      "-password"
    ); // For searching everything other than password write -password

    if (!user || user.username != decoded.username) {
      return res.status(404).json({ msg: "Invalid token" });
    }

    req.user = user
    req.body.username = decoded.username;
    // console.log("User verified ✅",);

    next();
  } catch (error) {
    console.log("Error while verifying user: ", error);
  }
};

export default verifyUser;
