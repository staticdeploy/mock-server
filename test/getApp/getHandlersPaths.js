const {expect} = require("chai");
const {createTree, destroyTree} = require("create-fs-tree");
const includes = require("lodash.includes");
const methods = require("methods");
const {tmpdir} = require("os");
const {basename, extname, join, isAbsolute} = require("path");

const getHandlersPaths = require("getApp/getHandlersPaths");

describe("getHandlersPaths", () => {

    const root = join(tmpdir(), "mock-server");

    before(() => {
        createTree(root, {
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
        });
    });
    after(() => {
        destroyTree(root);
    });

    describe("return value", () => {

        it("is an array of strings", () => {
            const paths = getHandlersPaths(root);
            // Ensure we're actually testing something
            expect(paths.length).not.to.equal(0);
            paths.forEach(path => {
                expect(path).to.be.a("string");
            });
        });

        it("is an array of non absolute paths", () => {
            const paths = getHandlersPaths(root);
            // Ensure we're actually testing something
            expect(paths.length).not.to.equal(0);
            paths.forEach(path => {
                expect(path).not.to.satisfy(isAbsolute);
            });
        });

        it("is an array of .something file paths", () => {
            const paths = getHandlersPaths(root);
            // Ensure we're actually testing something
            expect(paths.length).not.to.equal(0);
            paths.forEach(path => {
                expect(extname(path)).not.to.equal("");
            });
        });

        it("is an array of paths whose basename is a lowercase http method", () => {
            const paths = getHandlersPaths(root);
            // Ensure we're actually testing something
            expect(paths.length).not.to.equal(0);
            paths.forEach(path => {
                const isBasenameHttpMethod = includes(methods, basename(path, extname(path)));
                expect(isBasenameHttpMethod).to.equal(true);
            });
        });

        it("doesn't contain paths for non-handler files", () => {
            const paths = getHandlersPaths(root);
            // Ensure we're actually testing something
            expect(paths.length).not.to.equal(0);
            paths.forEach(path => {
                expect(path).not.to.match(/nonHandler\.js$/);
                expect(path).not.to.match(/nonHandler$/);
            });
        });

    });

    it("gets a list of all handler files in the specified directory (and its subdirectories) [GENERAL TEST]", () => {
        const paths = getHandlersPaths(root).sort();
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
