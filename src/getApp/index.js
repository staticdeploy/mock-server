const { getConfigScriptHandler } = require("@staticdeploy/app-config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const slow = require("connect-slow");
const cors = require("cors");
const decache = require("decache");
const express = require("express");
const { join } = require("path");

const getRoutes = require("./getRoutes");
const getMiddleware = require("./getMiddleware");
const interopRequire = require("./interopRequire");

function getRouter(root) {
    const router = express.Router();
    getRoutes(root).forEach(route => {
        const { method, path, handlerRequirePath } = route;
        // Since this function can be run multiple times when the watch option
        // is enabled, before getting the handler we need to delete the
        // (possibly) cached one - and all of its child modules - from require
        // cache. Otherwise we would keep getting the same old handler which
        // would not include the changes that triggered the server
        // configuration
        decache(handlerRequirePath);
        const handler = interopRequire(handlerRequirePath);
        if (typeof handler !== "function") {
            throw new Error(
                `Handler file for route "${method.toUpperCase()} ${path}" must export a function`
            );
        }
        // Register route
        router[method](path, handler);
    });
    return router;
}

module.exports = function getApp(options) {
    const { delay, root, serveConfig } = options;
    const server = express()
        // Delay requests by the specified amount of time
        .use(slow({ delay }))
        // Add cors headers
        .use(cors({ origin: /.*/, credentials: true }))
        // Parse common bodies
        .use(bodyParser.json({ limit: "1gb", strict: false }))
        .use(bodyParser.urlencoded({ limit: "1gb", extended: false }))
        .use(bodyParser.text({ limit: "1gb", type: "text/*" }))
        .use(bodyParser.raw({ limit: "1gb", type: "*/*" }))
        // Parse cookies
        .use(cookieParser())
        // Attach custom middleware and routes
        .use([
            ...getMiddleware(join(options.root, options.middleware)),
            getRouter(root)
        ]);

    // Serve /app-config.js
    if (serveConfig) {
        require("dotenv/config");
        server.get(
            "/app-config.js",
            getConfigScriptHandler({
                rawConfig: process.env,
                configKeyPrefix: "APP_CONFIG_"
            })
        );
    }

    return server;
};
