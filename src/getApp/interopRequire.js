/*
 *  Given a path, requires that path and returns its main export, i.e.
 *  `module.exports` if the file is a commonjs module, `export default` if the
 *  file is an es6 module
 */
module.exports = function interopRequire(path) {
    const mod = require(path);
    return mod && mod.__esModule ? mod["default"] : mod;
};
