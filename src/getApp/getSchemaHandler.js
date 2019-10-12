const decache = require("decache");
const mung = require("express-mung");

const errorHandler = require("./errorHandler");
const interopRequire = require("./interopRequire");

const initValidator = function(ajv, schema) {
    const validateBody = schema.body ? ajv.compile(schema.body) : () => true;
    const validateQuery = schema.query ? ajv.compile(schema.query) : () => true;
    const validateParams = schema.params
        ? ajv.compile(schema.params)
        : () => true;
    const validateResponse = schema.response
        ? ajv.compile(schema.response)
        : () => true;
    return {
        validateBody,
        validateQuery,
        validateParams,
        validateResponse
    };
};

function validateWrapper(ajv) {
    return function(req, validator, data, entity) {
        if (!data) {
            return;
        }
        const isValid = validator(data);
        if (!isValid) {
            req.schemaValidationFailed = entity;
            throw new Error(
                ajv.errorsText(validator.errors, { dataVar: entity })
            );
        }
    };
}

/*
 *  getMiddleware takes ajv instance and schema require path.
 *  Schema file must be a json that can contains these keys:
 *  * body: json schema of the expected input body
 *  * query: json schema of the expected input query
 *  * params: json schema of the expected input params
 *  * response: json schema to validate response body created in the handler
 */
module.exports = function(ajv, schemaRequirePath, originalHandler) {
    decache(schemaRequirePath);
    const schema = interopRequire(schemaRequirePath);
    if (schema && Object.keys(schema).length > 0) {
        const {
            validateParams,
            validateQuery,
            validateBody,
            validateResponse
        } = initValidator(ajv, schema);
        const validate = validateWrapper(ajv);
        const reqValidator = function(req, res, next) {
            validate(req, validateParams, req.params, "params");
            validate(req, validateQuery, req.query, "query");
            validate(req, validateBody, req.body, "requestBody");

            next();
        };
        const resValidator = mung.json(function(body, req) {
            validate(req, validateResponse, body, "response");

            return body;
        });
        mung.onError = errorHandler;
        return [reqValidator, resValidator, originalHandler];
    }
    return originalHandler;
};
