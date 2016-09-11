const bodyParser = require("body-parser");
const slow = require("connect-slow");
const cors = require("cors");
const express = require("express");

const getRoutes = require("./getRoutes");

function getRouter (root) {
    const router = express.Router();
    getRoutes(root).forEach(route => {
        const {method, path, handlerRequirePath} = route;
        // Since this function can be run multiple times when the watch option
        // is enabled, before getting the handler we need to delete the
        // (possibly) cached one from require cache. Otherwise we would keep
        // getting the same old handler which would not include the changes
        // that triggered the server reconfiguration
        delete require.cache[handlerRequirePath];
        const handler = require(handlerRequirePath);
        // Register route
        router[method](path, handler);
    });
    return router;
}

module.exports = function getApp (options) {
    const {root, delay} = options;
    return express()
        // connect-slow doesn't support 0ms delays. Temporary fix until
        // bahmutov/connect-slow #5 is resolved
        .use(slow({delay: (delay === 0 ? 1 : delay)}))
        .use(cors({origin: ["*"], credentials: true}))
        .use(bodyParser.json())
        .use(getRouter(root));
};
