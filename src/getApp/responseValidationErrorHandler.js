module.exports = function responseValidationErrorHandler(err, req, res, next) {
    if (req.schemaValidationFailed) {
        res.status(500).send({
            message: err.message,
            error: "Bad Response"
        });
        return;
    }
    next(err);
};
