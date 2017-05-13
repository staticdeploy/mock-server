const {expect} = require("chai");
const {createTree, destroyTree} = require("create-fs-tree");
const {tmpdir} = require("os");
const {join} = require("path");
const stripIndent = require("strip-indent");
const request = require("supertest");

const getApp = require("getApp");

describe("getApp", () => {

    const basedir = join(tmpdir(), "mock-server");

    afterEach(() => {
        destroyTree(basedir);
    });

    describe("returns an express app", () => {

        beforeEach(() => {
            const handlerFileContent = stripIndent(`
                module.exports = (req, res) => {
                    res.status(200).send({
                        method: req.method,
                        path: req.path,
                        params: req.params,
                        body: req.body
                    });
                };
            `);
            createTree(basedir, {
                "users": {
                    "{userId}": {
                        "get.js": handlerFileContent,
                        "put.js": handlerFileContent,
                        "nonHandler": handlerFileContent
                    },
                    "get.js": handlerFileContent,
                    "post.js": handlerFileContent,
                    "nonHandler.js": handlerFileContent
                },
                "get.js": handlerFileContent,
                "post": handlerFileContent
            });
        });

        it("whose responses carry cors headers allowing the requesting origin", () => {
            const app = getApp({
                root: basedir,
                delay: 0
            });
            return request(app)
                .get("/users/myUserId")
                .set("Origin", "http://localhost:8080")
                .expect(200)
                .expect("Access-Control-Allow-Origin", "http://localhost:8080");
        });

        describe("configured according to the contents of the server root directory", () => {

            it("test case GET /users/:userId", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .get("/users/myUserId")
                    .expect(200)
                    .expect({
                        method: "GET",
                        path: "/users/myUserId",
                        params: {
                            userId: "myUserId"
                        },
                        body: {}
                    });
            });

            it("test case PUT /users/:userId", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .put("/users/myUserId")
                    .send({key: "value"})
                    .expect(200)
                    .expect({
                        method: "PUT",
                        path: "/users/myUserId",
                        params: {
                            userId: "myUserId"
                        },
                        body: {key: "value"}
                    });
            });

            it("test case GET /users", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .get("/users")
                    .expect(200)
                    .expect({
                        method: "GET",
                        path: "/users",
                        params: {},
                        body: {}
                    });
            });

            it("test case POST /users", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .post("/users")
                    .send({key: "value"})
                    .expect(200)
                    .expect({
                        method: "POST",
                        path: "/users",
                        params: {},
                        body: {key: "value"}
                    });
            });

            it("test case GET /", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .get("/")
                    .expect(200)
                    .expect({
                        method: "GET",
                        path: "/",
                        params: {},
                        body: {}
                    });
            });

            it("test case GET /non-existing-path , non existing path", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .get("/non-existing-path")
                    .expect(404);
            });

            it("test case POST / , non existing method", () => {
                const app = getApp({
                    root: basedir,
                    delay: 0
                });
                return request(app)
                    .post("/")
                    .expect(404);
            });

        });

    });

    it("throws an error if a handler file doens't export a function", () => {
        createTree(basedir, {
            "get.js": ""
        });
        const troublemaker = () => {
            getApp({
                root: basedir,
                delay: 0
            });
        };
        expect(troublemaker).to.throw("Handler file for route \"GET /\" must export a function");
    });

});
