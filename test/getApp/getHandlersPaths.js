const {expect} = require("chai");
const includes = require("lodash.includes");
const mockFs = require("mock-fs");
const methods = require("methods");
const {basename, extname, isAbsolute} = require("path");

const getHandlersPaths = require("getApp/getHandlersPaths");

describe("getHandlersPaths", () => {

    before(() => {
        mockFs({
            "mock-server": {
                "users": {
                    "{userId}": {
                        "get.js": "",
                        "put.js": "",
                        "nonHandler": ""
                    },
                    "get.js": "",
                    "post.js": "",
                    "nonHandler.js": ""
                },
                "typescripts": {
                    "get.ts": "",
                    "post.ts": ""
                },
                "get.js": "",
                "post": ""
            }
        });
    });
    after(() => {
        mockFs.restore();
    });

    describe("return value", () => {

        it("is an array of strings", () => {
            const paths = getHandlersPaths("mock-server");
            paths.forEach(path => {
                expect(path).to.be.a("string");
            });
        });

        it("is an array of non absolute paths", () => {
            const paths = getHandlersPaths("mock-server");
            paths.forEach(path => {
                expect(path).not.to.satisfy(isAbsolute);
            });
        });

        it("is an array of .something file paths", () => {
            const paths = getHandlersPaths("mock-server");
            paths.forEach(path => {
                expect(extname(path)).not.to.equal("");
            });
        });

        it("is an array of paths whose basename is a lowercase http method", () => {
            const paths = getHandlersPaths("mock-server");
            paths.forEach(path => {
                const isBasenameHttpMethod = includes(methods, basename(path, extname(path)));
                expect(isBasenameHttpMethod).to.equal(true);
            });
        });

        it("doesn't contain paths for non-handler files", () => {
            const paths = getHandlersPaths("mock-server");
            paths.forEach(path => {
                expect(path).not.to.match(/nonHandler\.js$/);
                expect(path).not.to.match(/nonHandler$/);
            });
        });

    });

    it("gets a list of all handler files in the specified directory (and its subdirectories) [GENERAL TEST]", () => {
        const paths = getHandlersPaths("mock-server").sort();
        const expectedPaths = [
            "users/{userId}/get.js",
            "users/{userId}/put.js",
            "users/get.js",
            "users/post.js",
            "typescripts/get.ts",
            "typescripts/post.ts",
            "get.js"
        ].sort();
        expect(paths).to.deep.equal(expectedPaths);
    });

});
