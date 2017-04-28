const {sep} = require("path");

/*
*   Converts a handlerPath into an expressPath, using express url parameters
*   syntax and prepending the path with a / character. Examples:
*     - "users/get.js" -> "/users"
*     - "users/{userId}/get.js" -> "/users/:userId"
*/
module.exports = function toExpressPath (handlerPath) {
    return handlerPath
        // Split into tokens
        .split(sep)
        // Remove the last token `${method}.js`
        .slice(0, -1)
        // Convert tokens with the form "{param}" into ":param"
        .map(token => (
            /^{.*}$/.test(token) ? `:${token.slice(1, -1)}` : token
        ))
        // Join tokens with / characters
        .join("/")
        // Prepend the string with an additional / character
        .replace(/^/, "/");
};
