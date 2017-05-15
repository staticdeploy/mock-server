[![npm version](https://badge.fury.io/js/sd-mock-server.svg)](https://badge.fury.io/js/sd-mock-server)
[![Build Status](https://travis-ci.org/staticdeploy/sd-mock-server.svg?branch=master)](https://travis-ci.org/staticdeploy/sd-mock-server)
[![coverage](https://codecov.io/github/staticdeploy/sd-mock-server/coverage.svg?branch=master)](https://codecov.io/github/staticdeploy/sd-mock-server?branch=master)
[![Dependency Status](https://david-dm.org/staticdeploy/sd-mock-server.svg)](https://david-dm.org/staticdeploy/sd-mock-server)
[![devDependency Status](https://david-dm.org/staticdeploy/sd-mock-server/dev-status.svg)](https://david-dm.org/staticdeploy/sd-mock-server#info=devDependencies)

# sd-mock-server

Easy to use, no frills http mock server.

Suppose you're developing a frontend app that talks to one or more API services.
When running it locally - in your development environment - you need to somehow
provide those services to the app: you can either rely on a remote deployment,
start the services locally, or mock them.

`sd-mock-server` is a command line tool that helps you take the third approach,
allowing you to easily create and run a mock http server to run during
development ([and not only!](docs/recipes/mocking-for-selenium-tests.md)).

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
  - [mocking for selenium tests](docs/recipes/mocking-for-selenium-tests.md)
- examples:
  - [react app](https://github.com/staticdeploy/sd-mock-server/tree/master/examples/react-app)
  - [selenium tests](https://github.com/staticdeploy/sd-mock-server/tree/master/examples/selenium-tests)
