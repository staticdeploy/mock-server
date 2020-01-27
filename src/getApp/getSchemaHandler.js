const decache = require("decache");
const mung = require("express-mung");
const { get } = require("lodash");

const responseValidationErrorHandler = require("./responseValidationErrorHandler");
const interopRequire = require("./interopRequire");

const initValidator = function(ajv, schema) {
    const validateRequestBody = get(schema, "request.body")
        ? ajv.compile(get(schema, "request.body"))
        : () => true;
    const validateRequestQuery = get(schema, "request.query")
        ? ajv.compile(get(schema, "request.query"))
        : () => true;
    const validateRequestParams = get(schema, "request.params")
        ? ajv.compile(get(schema, "request.params"))
        : () => true;
    const validateResponseBody = get(schema, "response.body")
        ? ajv.compile(get(schema, "response.body"))
        : () => true;
    return {
        validateRequestBody: validateRequestBody,
        validateRequestQuery: validateRequestQuery,
        validateRequestParams: validateRequestParams,
        validateResponseBody: validateResponseBody
    };
};

function validateWrapper(ajv) {
    return function(req, validator, data, errorSource) {
        if (!data) {
            return;
        }
        const isValid = validator(data);
        if (!isValid) {
            req.schemaValidationFailed = errorSource;
            throw new Error(
                ajv.errorsText(validator.errors, { dataVar: errorSource })
            );
        }
    };
}

/*
 *  getMiddleware takes an ajv instance and the path to a schema file. The
 *  schema file is a json object containing some of the following keys:
 *  - request.body: json schema of  request body
 *  - request.query: json schema of the expected input query
 *  - request.params: json schema of the expected input params
 *  - response.body: json schema to validate response body created in the
 *    handler
 */
module.exports = function(ajv, schemaRequirePath, originalHandler) {
    decache(schemaRequirePath);
    const schema = interopRequire(schemaRequirePath);
    if (schema && Object.keys(schema).length > 0) {
        const {
            validateRequestParams,
            validateRequestQuery,
            validateRequestBody,
            validateResponseBody
        } = initValidator(ajv, schema);
        const validate = validateWrapper(ajv);
        const requestValidator = function(req, _res, next) {
            validate(req, validateRequestParams, req.params, "params");
            validate(req, validateRequestQuery, req.query, "query");
            validate(req, validateRequestBody, req.body, "requestBody");
            next();
        };
        const responseValidator = mung.json(function(body, req) {
            validate(req, validateResponseBody, body, "response");
            return body;
        });
        mung.onError = responseValidationErrorHandler;
        return [requestValidator, responseValidator, originalHandler];
    }
    return originalHandler;
};
