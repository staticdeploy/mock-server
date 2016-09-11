const {expect} = require("chai");
const mockFs = require("mock-fs");
const sortBy = require("lodash.sortby");

const getRoutes = require("getApp/getRoutes");

describe("getRoutes", () => {

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
                "get.js": "",
                "post": ""
            }
        });
    });
    after(() => {
        mockFs.restore();
    });

    it("returns a list of route objects generated from files in the server root directory [GENERAL TEST]", () => {
        const routes = sortBy(getRoutes("mock-server"), "path");
        const requireBasePath = `${process.cwd()}/mock-server`;
        const expectedRoutes = sortBy([
            {
                handlerRequirePath: `${requireBasePath}/users/{userId}/get.js`,
                method: "get",
                path: "/users/:userId"
            },
            {
                handlerRequirePath: `${requireBasePath}/users/{userId}/put.js`,
                method: "put",
                path: "/users/:userId"
            },
            {
                handlerRequirePath: `${requireBasePath}/users/get.js`,
                method: "get",
                path: "/users"
            },
            {
                handlerRequirePath: `${requireBasePath}/users/post.js`,
                method: "post",
                path: "/users"
            },
            {
                handlerRequirePath: `${requireBasePath}/get.js`,
                method: "get",
                path: "/"
            }
        ], "path");
        expect(routes).to.deep.equal(expectedRoutes);
    });

});
