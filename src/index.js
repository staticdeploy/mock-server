const {cyan, green} = require("chalk");
const log = require("fancy-log");
const {createServer} = require("http");
const debounce = require("lodash.debounce");
const fsWatch = require("node-watch");
const {basename} = require("path");

const getApp = require("./getApp");

module.exports = function startServer (options) {
    const {root, watch, port} = options;
    // Load (require) require-s passed in as options
    options.require.forEach(require);
    const server = createServer()
        .addListener("request", getApp(options))
        .listen(port, () => {
            log(`${cyan("sd-mock-server")} listening on http://localhost:${port}`);
        });
    if (watch) {
        // Reconfigure the server on file change. Reconfiguring the server
        // means replacing the listener for the request event. We replace the
        // old app, created with the old configuration, with the new app,
        // created with the new configuration.
        fsWatch(root, {recursive: true}, debounce(() => {
            log(`Change detected in directory ${green(basename(root))}, reconfiguring ${cyan("sd-mock-server")}`);
            server
                .removeAllListeners("request")
                .addListener("request", getApp(options));
        }, 1000));
    }
};
