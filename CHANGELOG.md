## 3.0.0 (Apr 24, 2022)

Breaking changes:

- upgrade ajv validation from v6 to v8
- drop Node.js v10.x support

## 2.0.0 (May 1, 2020)

Features:

- add `delay` method to express response object to allow delaying individual
  responses

Breaking changes:

- require node >= v10

## 1.11.0 (January 27, 2020)

Features:

- support validating requests and responses with schema files

## 1.10.0 (December 13, 2018)

Features:

- support using custom middleware

## 1.9.0 (October 8, 2018)

Features:

- support parsing and setting cookies in handlers

## 1.8.1 (September 7, 2018)

Fixes:

- correctly declare `@staticdeploy/app-config` as dependency

## 1.8.0 (June 19, 2018)

Features:

- when serving `/app-config.js`, auto-import variables defined in `.env`

Chores:

- use `@staticdeploy/app-config` instead of `@staticdeploy/app-server`

## 1.7.0 (November 21, 2017)

Features:

- parse json request bodies in non-strict mode

## 1.6.2 (October 2, 2017)

Fixes:

- don't filter files starting with a dot (issue #5)

## 1.6.1 (September 29, 2017)

Fixes:

- publish `ssl` folder to npm

## 1.6.0 (September 29, 2017)

Features:

- add option (`--useHttps`) to serve via https

## 1.5.0 (September 16, 2017)

Features:

- add option (`--serveConfig`) to serve config script generated by
  [app-server](https://github.com/staticdeploy/app-server)

## 1.4.0 (September 16, 2017)

Rename package from `sd-mock-server` to `@staticdeploy/mock-server`.

## 1.3.0 (May 14, 2017)

Features:

- support non-json bodies

## 1.2.0 (April 26, 2017)

Features:

- support non `.js` handler files
- throw an informative error when a handler file doesn't export a function

## 1.1.0 (April 21, 2017)

Features:

- add `--require` option
- increase body length limit for json requests

## 1.0.4 (September 16, 2016)

First stable, acceptably-bug-free release.
