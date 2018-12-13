const { existsSync } = require("fs");

const interopRequire = require("./interopRequire");

/*
 *  getMiddleware takes as input the path to a middleware file which exports an
 *  array of express middleware functions. If no file exists at the provided
 *  path, an empty array is returned
 */
module.exports = function getMiddleware(middlewarePath) {
    if (!existsSync(middlewarePath)) {
        return [];
    }
    const middleware = interopRequire(middlewarePath);
    if (!Array.isArray(middleware)) {
        throw new Error(
            "The middleware file must export an array of express midleware functions"
        );
    }
    return middleware;
};
