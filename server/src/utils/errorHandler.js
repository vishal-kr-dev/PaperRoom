export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        route: err.route || `${req.method} ${req.originalUrl}`,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
