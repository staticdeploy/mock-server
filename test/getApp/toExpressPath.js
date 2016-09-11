const {expect} = require("chai");

const toExpressPath = require("getApp/toExpressPath");

describe("toExpressPath", () => {

    it("removes the file name and last / character", () => {
        const expressPath = toExpressPath("users/get.js");
        expect(expressPath).not.to.match(/\/get\.js$/);
    });

    it("prepends the path with a / character", () => {
        const expressPath = toExpressPath("users/get.js");
        expect(expressPath).to.match(/^\//);
    });

    it("converts sd-mock-server url params syntax into express param syntax", () => {
        const expressPath = toExpressPath("users/{userId}/get.js");
        expect(expressPath).to.match(/:userId/);
    });

    it("converts handlerPaths into expressPaths [GENERAL TEST]", () => {
        const expressPaths = [
            "users/get.js",
            "users/{userId}/get.js"
        ].map(toExpressPath).sort();
        const expectedExpressPaths = [
            "/users",
            "/users/:userId"
        ].sort();
        expect(expressPaths).to.deep.equal(expectedExpressPaths);
    });

});
