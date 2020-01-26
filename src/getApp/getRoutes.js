const { basename, dirname, extname, join, resolve } = require("path");

const getHandlersPaths = require("./getHandlersPaths");
const toExpressPath = require("./toExpressPath");

/*
 *  getRoutes takes as input the path to the server root directory. It finds
 *  all handlers in that directory by calling getHandlersPaths. Then it builds
 *  a list of route objects which will be used to configure the express router
 */
module.exports = function getRoutes(root) {
    return getHandlersPaths(root).map(handlerPath => {
        const fileName = basename(handlerPath, extname(handlerPath));
        return {
            handlerRequirePath: join(resolve(root), handlerPath),
            method: fileName,
            path: toExpressPath(handlerPath),
            schemaRequirePath: join(
                resolve(root),
                dirname(handlerPath),
                `${fileName}.schema.json`
            )
        };
    });
};
