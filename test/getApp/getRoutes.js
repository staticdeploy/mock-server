const {expect} = require("chai");
const {createTree, destroyTree} = require("create-fs-tree");
const sortBy = require("lodash.sortby");
const {tmpdir} = require("os");
const {join} = require("path");

const getRoutes = require("getApp/getRoutes");

describe("getRoutes", () => {

    const basedir = join(tmpdir(), "mock-server");

    before(() => {
        createTree(basedir, {
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
            "get.js": "",
            "post": ""
        });
    });
    after(() => {
        destroyTree(basedir);
    });

    it("returns a list of route objects generated from files in the server root directory [GENERAL TEST]", () => {
        const routes = sortBy(getRoutes(basedir), "path");
        const expectedRoutes = sortBy([
            {
                handlerRequirePath: `${basedir}/users/{userId}/get.js`,
                method: "get",
                path: "/users/:userId"
            },
            {
                handlerRequirePath: `${basedir}/users/{userId}/put.js`,
                method: "put",
                path: "/users/:userId"
            },
            {
                handlerRequirePath: `${basedir}/users/get.js`,
                method: "get",
                path: "/users"
            },
            {
                handlerRequirePath: `${basedir}/users/post.js`,
                method: "post",
                path: "/users"
            },
            {
                handlerRequirePath: `${basedir}/get.js`,
                method: "get",
                path: "/"
            }
        ], "path");
        expect(routes).to.deep.equal(expectedRoutes);
    });

});
