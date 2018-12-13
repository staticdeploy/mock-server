const { createTree, destroyTree } = require("create-fs-tree");
const { expect } = require("chai");
const { tmpdir } = require("os");
const { join } = require("path");

const getMiddleware = require("getApp/getMiddleware");

describe("getMiddleware", () => {
    const root = join(tmpdir(), "mock-server/getApp/getMiddleware");
    const middlewarePath = join(root, "middleware.js");

    afterEach(() => {
        destroyTree(root);
    });

    it("if no file exists at the specified path, returns an empty array", () => {
        createTree(root, {});
        const middleware = getMiddleware(middlewarePath);
        expect(middleware).to.deep.equal([]);
    });

    it("if the specified file doesn't export an array, throws an error", () => {
        createTree(root, {
            "no-array-middleware.js": "module.exports = 0"
        });
        const troublemaker = () =>
            getMiddleware(join(root, "no-array-middleware.js"));
        expect(troublemaker).to.throw(
            "The middleware file must export an array of express midleware functions"
        );
    });

    it("returns the array exported by the file", () => {
        createTree(root, {
            "middleware.js": "module.exports = []"
        });
        const middleware = getMiddleware(join(root, "middleware.js"));
        expect(middleware).to.deep.equal([]);
    });
});
