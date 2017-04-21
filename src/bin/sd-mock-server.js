#!/usr/bin/env node

const yargs = require("yargs");
const {resolve} = require("path");

const startServer = require("../");
const pkg = require("../../package");

const argv = yargs
    .version(pkg.version)
    .help("h")
    .alias("h", "help")
    .wrap(100)
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
    .option("delay", {
        default: 0,
        describe: "Milliseconds to delay responses by",
        type: "number"
    })
    .option("bodyLimit", {
        default: "100kb",
        describe: "Controls the maximum request body size",
        type: "string"
    })
    .option("watch", {
        default: false,
        describe: "Reload server on file changes",
        type: "boolean"
    })
    .option("require", {
        alias: "requiredModules",
        default: [],
        describe: "Require the given modules",
        type: "array"
    })
    .argv;

startServer(argv);
