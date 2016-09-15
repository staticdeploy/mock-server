const bodyParser = require("body-parser");
const slow = require("connect-slow");
const cors = require("cors");
const decache = require("decache");
const express = require("express");

const getRoutes = require("./getRoutes");

function getRouter (root) {
    const router = express.Router();
    getRoutes(root).forEach(route => {
        const {method, path, handlerRequirePath} = route;
        // Since this function can be run multiple times when the watch option
        // is enabled, before getting the handler we need to delete the
        // (possibly) cached one - and all of its child modules - from require
        // cache. Otherwise we would keep getting the same old handler which
        // would not include the changes that triggered the server
        // configuration
        decache(handlerRequirePath);
        const handler = require(handlerRequirePath);
        // Register route
        router[method](path, handler);
    });
    return router;
}

module.exports = function getApp (options) {
    const {root, delay} = options;
    return express()
        .use(slow({delay}))
        .use(cors({origin: /.*/, credentials: true}))
        .use(bodyParser.json())
        .use(getRouter(root));
};
