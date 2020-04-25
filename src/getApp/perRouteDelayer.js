/*
 *  perRouteDelayer is a middleware to add a delay to the response
 */
module.exports = function perRouteDelayer(req, res, next) {
    const original = res.end;

    res.end = function(...args) {
        const delayMs = res.delayMs;
        if (res.finished) {
            return;
        }
        if (delayMs) {
            setTimeout(function() {
                original.apply(res, args);
            }, delayMs);
            return;
        }

        original.apply(res, args);
    };

    next();
};
