import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
    },
    streakUpdate: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.incrementTotalPoints = async function (amount) {
  this.totalPoints += amount;
  return await this.save();
};

userSchema.methods.updateStreak = async function () {
  const today = new Date();
  const lastUpdate = new Date(this.streakUpdate);

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
    return this;
  } else if (diffInDays === 1) {
    this.streak += 1;
  } else {
    this.streak = 1;
  }

  this.streakUpdate = today;
  return await this.save();
};

userSchema.index({ email: 1 });
userSchema.index({ roomId: 1 });

export const User = mongoose.model("User", userSchema);
