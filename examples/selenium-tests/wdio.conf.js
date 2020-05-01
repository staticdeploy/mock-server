const { execSync, spawn } = require("child_process");

let staticServer;
let mockServer;

exports.config = {
    specs: ["./e2e/**/*.js"],
    sync: false,
    capabilities: [{ browserName: "chrome" }],
    logLevel: "silent",
    coloredLogs: true,
    screenshotPath: "./errorShots/",
    baseUrl: "http://localhost:8080",
    services: ["selenium-standalone"],
    framework: "mocha",
    reporters: ["spec"],
    onPrepare: () => {
        console.log("Building app...");
        execSync("yarn build");
        console.log("Starting mock and static servers...");
        mockServer = spawn("yarn", ["start:mock-server"]);
        staticServer = spawn("yarn", ["serve"]);
    },
    onComplete: () => {
        console.log("Stopping mock and static servers...");
        mockServer.kill();
        staticServer.kill();
    },
};
