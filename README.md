[![npm version](https://badge.fury.io/js/sd-mock-server.svg)](https://badge.fury.io/js/sd-mock-server)
[![Build Status](https://travis-ci.org/staticdeploy/sd-mock-server.svg?branch=master)](https://travis-ci.org/staticdeploy/sd-mock-server)
[![coverage](https://codecov.io/github/staticdeploy/sd-mock-server/coverage.svg?branch=master)](https://codecov.io/github/staticdeploy/sd-mock-server?branch=master)
[![Dependency Status](https://david-dm.org/staticdeploy/sd-mock-server.svg)](https://david-dm.org/staticdeploy/sd-mock-server)
[![devDependency Status](https://david-dm.org/staticdeploy/sd-mock-server/dev-status.svg)](https://david-dm.org/staticdeploy/sd-mock-server#info=devDependencies)

# sd-mock-server

Easy to use, no frills mock server.

This tool is useful when developing (and testing) frontend apps or backend
services which talk to a multitude of external REST services. Instead of having
to start locally (or in a remote dev environment) each external service, you can
use `sd-mock-server` to easily write a local server which replicates the
behavior of those services. Then, when developing our app/service, you start the
local mock server and point your app/service to it.

### Install

```sh
npm i --save-dev sd-mock-server
```

### Quickstart

- create a directory `mock-server`
- create your first handler file `mock-server/get.js`
  ```js
  module.exports = (req, res) => res.send("OK");
  ```
- start the mock server
  ```sh
  $ node_modules/.bin/sd-mock-server
  ```
- call the mocked route
  ```sh
  $ curl http://localhost:3456/
  ```

You add routes to the mock server by adding handler files at the corresponding
path under the `mock-server` directory. Example:

```
mock-server
├── get.js -> handler for GET /
└── users
    ├── {userId}
    |   ├── get.js -> handler for GET /users/1
    |   └── put.js -> handler for PUT /user/1
    ├── get.js -> handler for GET /users
    └── post.js -> handler for POST /users
```

### Documentation

- [user guide](docs/user-guide.md)
- recipes:
  - [writing handler files in a compile-to-js language](docs/recipes/using-compile-to-js-languages.md)
  - [mocking a graphql server](docs/recipes/mocking-a-graphql-server.md)
- examples:
  - [react app](https://github.com/staticdeploy/sd-mock-server/tree/master/examples/react-app)
