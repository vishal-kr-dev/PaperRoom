export const sendResponse = (
    res,
    statusCode = 200,
    data = null,
    message = ""
) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
    });
};
