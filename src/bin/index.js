#!/usr/bin/env node

const yargs = require("yargs");
const { resolve } = require("path");

const startServer = require("../");

const argv = yargs
    .usage("Usage: $0 <options>")
    .option("root", {
        coerce: resolve,
        default: "mock-server",
        describe: "Mock server root directory",
        type: "string"
    })
    .option("port", {
        default: "3456",
        describe: "Mock server port",
        type: "string"
    })
    .option("useHttps", {
        default: false,
        describe: "Use https protocol instead of http",
        type: "boolean"
    })
    .option("delay", {
        default: 0,
        describe: "Milliseconds to delay responses by",
        type: "number"
    })
    .option("watch", {
        default: false,
        describe: "Reload server on file changes",
        type: "boolean"
    })
    .option("serveConfig", {
        default: false,
        describe: "Generate and serve /app-config.js",
        type: "boolean"
    })
    .option("require", {
        default: [],
        describe: "Require the given modules",
        type: "array"
    })
    .option("middleware", {
        default: null,
        describe: "path to file which returns array of express middleware",
        type: "string"
    })
    .wrap(Math.min(120, yargs.terminalWidth()))
    .strict().argv;

startServer(argv);
