module.exports = function errorHandler(err, req, res, next) {
    if (req.schemaValidationFailed) {
        res.status(400).send({
            message: err.message,
            error: "Bad Request"
        });
        return;
    }
    next(err);
};
