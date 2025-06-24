export const validate =
    (schema, source = "body") =>
    (req, res, next) => {
        try {
            req[source] = schema.parse(req[source]);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
        }
    };
