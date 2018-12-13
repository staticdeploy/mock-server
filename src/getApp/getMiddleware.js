const { join, resolve } = require("path");

module.exports = function getMiddleware(options) {
    const middlewarePath = join(resolve(options.root), options.middleware);
    const middlewareExport = require(middlewarePath);
    const middleware =
        middlewareExport && middlewareExport.__esModule
            ? middlewareExport.default
            : middlewareExport;
    return middleware(options);
};
