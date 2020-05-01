const express = require("express");
const request = require("supertest");

const requestValidationErrorHandler = require("getApp/requestValidationErrorHandler");

describe("error handler", () => {
    let server;
    beforeEach(() => {
        server = express()
            .get("/teapot-error", (req, res) => {
                res.status(418).send({
                    message: "my error message",
                });
            })
            .get("/validation-error", (req, res, next) => {
                req.schemaValidationFailed = "entity";
                next(new Error("some error"));
            })
            .use(requestValidationErrorHandler);
    });

    it("returns correct error if schemaValidationFailed falsy", () => {
        return request(server).get("/teapot-error").expect(418).expect({
            message: "my error message",
        });
    });

    it("returns correctly if schemaValidationFailed truly", () => {
        return request(server).get("/validation-error").expect(400).expect({
            message: "some error",
            error: "Bad Request",
        });
    });
});
