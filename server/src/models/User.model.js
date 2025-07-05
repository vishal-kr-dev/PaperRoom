import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
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

userSchema.index({ roomId: 1 });
userSchema.index({ experience: -1 });
userSchema.index({ monthlyExperience: -1 });

export const User = mongoose.model("User", userSchema);
