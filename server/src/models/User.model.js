import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        // Auth
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },

        // Profile
        avatar: {
            type: String,
            default:
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            default: null,
        },

        // Gamification
        totalXp: {
            type: Number,
            default: 0,
            min: 0,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },

        // Streaks
        currentStreak: {
            type: Number,
            default: 0,
            min: 0,
        },
        streakUpdate: {
            type: Date,
            default: Date.now,
        },

        // Security
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
        passwordResetToken: {
            type: String,
            default: null,
            select: false,
        },
        passwordResetTokenExpiry: {
            type: Date,
            default: null,
            select: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password if changed
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Normalize email
userSchema.pre("save", function (next) {
    if (this.isModified("email")) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// Methods
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
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

userSchema.methods.addExperience = async function (amount) {
    this.experience += amount;
    this.monthlyExperience += amount;

    const getLevelFromXP = (xp) => Math.floor(0.1 * Math.sqrt(xp)) + 1;
    this.level = getLevelFromXP(this.experience);

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
        this.currentStreak += 1;
    } else {
        this.currentStreak = 1;
    }

    this.streakUpdate = today;
    return await this.save();
};

userSchema.index({ roomId: 1 });
userSchema.index({ experience: -1 });
userSchema.index({ monthlyExperience: -1 });

export const User = mongoose.model("User", userSchema);
