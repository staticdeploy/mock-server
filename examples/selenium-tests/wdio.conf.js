const {execSync, spawn} = require("child_process");

let staticServer;
let mockServer;

exports.config = {
    specs: ["./e2e/**/*.js"],
    sync: false,
    capabilities: [{browserName: "chrome"}],
    logLevel: "silent",
    coloredLogs: true,
    screenshotPath: "./errorShots/",
    baseUrl: "http://localhost:8080",
    services: ["selenium-standalone"],
    framework: "mocha",
    reporters: ["spec"],
    onPrepare: async () => {
        console.log("Building app...");
        execSync("npm run build");
        console.log("Starting mock and static servers...");
        mockServer = spawn("npm", ["run", "start:mock-server"]);
        staticServer = spawn("npm", ["run", "serve"]);
    },
    onComplete: () => {
        console.log("Stopping mock and static servers...");
        mockServer.kill();
        staticServer.kill();
    }
};
