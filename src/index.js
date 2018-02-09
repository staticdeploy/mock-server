const { cyan, green } = require("chalk");
const log = require("fancy-log");
const http = require("http");
const https = require("https");
const debounce = require("lodash.debounce");
const fsWatch = require("node-watch");
const { basename, dirname, join } = require("path");

const getApp = require("./getApp");
const getCert = require("./getCert");

function getRootFromPkgName(name) {
    const pkgJsonPath = require.resolve(`${name}/package`);
    const pkgPath = dirname(pkgJsonPath);
    return join(pkgPath, "mock-server");
}

module.exports = function startServer(options) {
    const { root, from, delay, serveConfig, watch, port, useHttps } = options;

    // Build getApp options. In particular, determine which will be the root
    // directory of the server
    const getAppOptions = {
        root: from ? getRootFromPkgName(from) : root,
        delay: delay,
        serveConfig: serveConfig
    };

    // Load (require) require-s passed in as options
    options.require.forEach(require);

    // Create and start the server
    const server = useHttps
        ? https.createServer(getCert())
        : http.createServer();
    server.addListener("request", getApp(getAppOptions)).listen(port, () => {
        const mockServer = cyan("mock-server");
        const protocol = useHttps ? "https:" : "http:";
        log(`${mockServer} listening on ${protocol}//localhost:${port}`);
    });

    // When the watch flag is set, reconfigure the server on file change.
    // Reconfiguring the server means replacing the listener for the request
    // event. We replace the old app, created with the old configuration, with
    // the new app, created with the new configuration.
    if (watch) {
        fsWatch(
            root,
            { recursive: true },
            debounce(() => {
                log(
                    `Change detected in directory ${green(
                        basename(root)
                    )}, reconfiguring ${cyan("mock-server")}`
                );
                server
                    .removeAllListeners("request")
                    .addListener("request", getApp(getAppOptions));
            }, 1000)
        );
    }
};
