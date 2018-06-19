[![npm version](https://img.shields.io/npm/v/@staticdeploy/mock-server.svg)](https://www.npmjs.com/package/@staticdeploy/mock-server)
[![build status](https://img.shields.io/circleci/project/github/staticdeploy/mock-server.svg)](https://circleci.com/gh/staticdeploy/mock-server)
[![coverage status](https://codecov.io/github/staticdeploy/mock-server/coverage.svg?branch=master)](https://codecov.io/github/staticdeploy/mock-server?branch=master)
[![dependency status](https://david-dm.org/staticdeploy/mock-server.svg)](https://david-dm.org/staticdeploy/mock-server)
[![devDependency status](https://david-dm.org/staticdeploy/mock-server/dev-status.svg)](https://david-dm.org/staticdeploy/mock-server#info=devDependencies)

# mock-server

Easy to use, no frills http mock server.

Suppose you're developing a frontend app that talks to one or more API services.
When running it locally - in your development environment - you need to somehow
provide those services to the app: you can either rely on a remote deployment,
start the services locally, or mock them.

`mock-server` is a command line tool that helps you take the third approach,
allowing you to easily create and run a mock http server to run during
development ([and not only!](docs/recipes/mocking-for-selenium-tests.md)).

### Install

```sh
npm i --save-dev @staticdeploy/mock-server
```

### Quickstart

- create a directory `mock-server`
- create your first handler file `mock-server/get.js`
  ```js
  module.exports = (req, res) => res.send("OK");
  ```
- start the mock server
  ```sh
  $ node_modules/.bin/mock-server
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
- [why you should use `mock-server`](docs/why-use-mock-server.md)
- recipes:
  - [writing handler files in a compile-to-js language](docs/recipes/using-compile-to-js-languages.md)
  - [mocking a graphql server](docs/recipes/mocking-a-graphql-server.md)
  - [mocking for selenium tests](docs/recipes/mocking-for-selenium-tests.md)
    <!-- Use full urls since these links also need to work in gitbook -->
- examples:
  - [react app](https://github.com/staticdeploy/mock-server/tree/master/examples/react-app)
  - [selenium tests](https://github.com/staticdeploy/mock-server/tree/master/examples/selenium-tests)
