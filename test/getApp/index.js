const mockFs = require("mock-fs");
const mockRequire = require("mock-require");
const request = require("supertest");

const getApp = require("getApp");

describe("getApp", () => {

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
        const requireBasePath = `${process.cwd()}/mock-server`;
        const handlerRequirePaths = [
            `${requireBasePath}/users/{userId}/get.js`,
            `${requireBasePath}/users/{userId}/put.js`,
            `${requireBasePath}/users/get.js`,
            `${requireBasePath}/users/post.js`,
            `${requireBasePath}/get.js`
        ];
        const handler = (req, res) => {
            res.status(200).send({
                method: req.method,
                path: req.path,
                params: req.params,
                body: req.body
            });
        };
        handlerRequirePaths.forEach(handlerRequirePath => {
            mockRequire(handlerRequirePath, handler);
        });
    });
    after(() => {
        mockFs.restore();
        mockRequire.stopAll();
    });

    describe("returns an express app", () => {

        it("whose responses carry cors headers allowing the requesting origin", () => {
            const app = getApp({
                root: "mock-server",
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
                    root: "mock-server",
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
                    root: "mock-server",
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
                    root: "mock-server",
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
                    root: "mock-server",
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
                    root: "mock-server",
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
                    root: "mock-server",
                    delay: 0
                });
                return request(app)
                    .get("/non-existing-path")
                    .expect(404);
            });

            it("test case POST / , non existing method", () => {
                const app = getApp({
                    root: "mock-server",
                    delay: 0
                });
                return request(app)
                    .post("/")
                    .expect(404);
            });

        });

    });

});
