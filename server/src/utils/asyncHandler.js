export const asyncHandler = (fn) => {
    return (req, res, next) => {
        const route = `${req.method} ${req.originalUrl}`;

        Promise.resolve(fn(req, res, next)).catch((err) => {
            err.route = route;
            next(err);
        });
    };
};
