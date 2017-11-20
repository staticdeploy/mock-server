const bodyParser = require("body-parser");
const slow = require("connect-slow");
const cors = require("cors");
const decache = require("decache");
const express = require("express");

const getRoutes = require("./getRoutes");

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
        const handlerExport = require(handlerRequirePath);
        const handler =
            handlerExport && handlerExport.__esModule
                ? handlerExport.default
                : handlerExport;
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
        .use(slow({ delay }))
        .use(cors({ origin: /.*/, credentials: true }))
        .use(bodyParser.json({ limit: "1gb", strict: false }))
        .use(bodyParser.urlencoded({ limit: "1gb", extended: false }))
        .use(bodyParser.text({ limit: "1gb", type: "text/*" }))
        .use(bodyParser.raw({ limit: "1gb", type: "*/*" }))
        .use(getRouter(root));
    if (serveConfig) {
        server.get(
            "/app-config.js",
            require("@staticdeploy/app-server").getConfigScriptHandler()
        );
    }
    return server;
};
