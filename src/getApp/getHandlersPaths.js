const recursiveReaddirSync = require("fs-readdir-recursive");
const includes = require("lodash.includes");
const methods = require("methods");
const {basename, extname} = require("path");

/*
*   A handler file is a .js (or .something) file whose name matches an http
*   method. Examples:
*     - get.js
*     - post.js
*   The function returns an array of paths relative to the input directory.
*   Example:
*     given the following filesystem structure:
*       process.cwd()
*       └─ mock-server
*          └─ users
*             ├─ {userId}
*             │  ├─ get.js
*             │  └─ put.js
*             ├─ get.js
*             └─ post.js
*     calling getHandlersPaths("mock-server") returns:
*       [
*         "users/{userId}/get.js",
*         "users/{userId}/put.js",
*         "users/get.js",
*         "users/post.js"
*       ]
*/
module.exports = function getHandlersPaths (directory) {
    return recursiveReaddirSync(directory)
        .filter(name => (
            extname(name) !== "" &&
            includes(methods, basename(name, extname(name)))
        ));
};
