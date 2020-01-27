const { expect } = require("chai");
const { createTree, destroyTree } = require("create-fs-tree");
const { sortBy } = require("lodash");
const { tmpdir } = require("os");
const { join } = require("path");

const getRoutes = require("getApp/getRoutes");

describe("getRoutes", () => {
    const root = join(tmpdir(), "mock-server/getApp/getRoutes");

    before(() => {
        createTree(root, {
            users: {
                "{userId}": {
                    "get.js": "",
                    "put.js": "",
                    nonHandler: ""
                },
                "get.js": "",
                "post.js": "",
                "nonHandler.js": ""
            },
            "get.js": "",
            post: ""
        });
    });
    after(() => {
        destroyTree(root);
    });

    it("returns a list of route objects generated from files in the server root directory [GENERAL TEST]", () => {
        const routes = sortBy(getRoutes(root), "path");
        const expectedRoutes = sortBy(
            [
                {
                    handlerRequirePath: `${root}/users/{userId}/get.js`,
                    method: "get",
                    path: "/users/:userId",
                    schemaRequirePath: `${root}/users/{userId}/get.schema.json`
                },
                {
                    handlerRequirePath: `${root}/users/{userId}/put.js`,
                    method: "put",
                    path: "/users/:userId",
                    schemaRequirePath: `${root}/users/{userId}/put.schema.json`
                },
                {
                    handlerRequirePath: `${root}/users/get.js`,
                    method: "get",
                    path: "/users",
                    schemaRequirePath: `${root}/users/get.schema.json`
                },
                {
                    handlerRequirePath: `${root}/users/post.js`,
                    method: "post",
                    path: "/users",
                    schemaRequirePath: `${root}/users/post.schema.json`
                },
                {
                    handlerRequirePath: `${root}/get.js`,
                    method: "get",
                    path: "/",
                    schemaRequirePath: `${root}/get.schema.json`
                }
            ],
            "path"
        );
        expect(routes).to.deep.equal(expectedRoutes);
    });
});
