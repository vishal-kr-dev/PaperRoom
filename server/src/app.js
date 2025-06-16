import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
});
app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
});
app.use("/api/v1/auth", authRoutes);

// 404 Handler
app.use((req, res, next) => {
    const error = {};
    error.message = `Route not found - ${req.originalUrl}`;
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});


// Error Handler
app.use(errorHandler);

export default app;
