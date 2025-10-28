const errorHandler = (err, req, res, next) => {
    // Centralized error handler to normalize error responses
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Something went wrong";

    if (res.headersSent) {
        return next(err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export { errorHandler };
