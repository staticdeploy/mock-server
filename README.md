[![npm version](https://badge.fury.io/js/sd-mock-server.svg)](https://badge.fury.io/js/sd-mock-server)
[![Build Status](https://travis-ci.org/staticdeploy/sd-mock-server.svg?branch=master)](https://travis-ci.org/staticdeploy/sd-mock-server)
[![coverage](https://codecov.io/github/staticdeploy/sd-mock-server/coverage.svg?branch=master)](https://codecov.io/github/staticdeploy/sd-mock-server?branch=master)
[![Dependency Status](https://david-dm.org/staticdeploy/sd-mock-server.svg)](https://david-dm.org/staticdeploy/sd-mock-server)
[![devDependency Status](https://david-dm.org/staticdeploy/sd-mock-server/dev-status.svg)](https://david-dm.org/staticdeploy/sd-mock-server#info=devDependencies)

# sd-mock-server

Easy to use, no frills mock server.

This tool is useful when developing (and testing) frontend apps or backend
services which speak to a multitude of external REST services. Instead of having
to start locally (or in a remote dev environment) each external service, we can
use `sd-mock-server` to easily write a local server which replicates the
behavior of those services. Then, when developing our app/service, we start the
local mock server and point our app/service to it.

## Install

```sh
npm i --save-dev sd-mock-server
```

## Usage

* create a directory `mock-server`
* place some handler files in it (read below for how to write them)
* run `sd-mock-server`

### CLI options

* `root`: mock server root directory, defaults to `mock-server`
* `port`: mock server port, defaults to `3456`
* `delay`: milliseconds to delay responses by, defaults to 0
* `watch`: boolean flag, makes the server reload on file changes
* `require`: require a module before startup, can be used multiple times

### How to write handler files

Handler files are files whose basename matches an http method:
`mock-server/get.js`, `mock-server/users/post.js` etc.

Handler files export an [express](http://expressjs.com) route handler:

```js
// mock-server/get.js
module.exports = (req, res) => {
    res.status(200).send("OK");
};
```

The function exported by a handler file is registered as the handler for the
route whose path matches the handler file's path relative to the `mock-server`
directory, and whose method matches the handler file's name. Examples:

* the function exported by `mock-server/get.js` is registered as the handler
  for route `GET /`
* the function exported by `mock-server/users/post.js` is registered as the
  handler for route `POST /users`

You can also use route params:

* the function exported by `mock-server/users/{userId}/get.js` is registered as
  the handler for route `GET /users/:userId`

Which you can access as you would in express:

```js
// mock-server/users/{userId}/get.js
module.exports = (req, res) => {
    console.log(req.params.userId);
    res.status(200).send(`userId: ${req.params.userId}`);
};
```

> Note: the path syntax for parametric routes is `.../{param}/...` instead of
> `.../:param/...` because the latter path is not valid for some filesystems (eg
> NTFS)

### Writing handler files in ES201X / TypeScript / etc

It's possible to write handler files in a compile-to-js language by simply
writing the files in that language and registering a require hook when starting
`sd-mock-server`.

ES201X example:

```js
// mock-server/get.js
export default function handler (req, res) {
    req.status(200).send("OK");
}
```

and start the server with `sd-mock-server --require babel-register`. (Note:
you'll also need to have a `.babelrc` file which specifies how you want your
ES201X code to be transpiled).

### Mocking a graphql service

To mock a graphql service we can use `sd-mock-server` in combination with
[apollographql/graphql-tools](https://github.com/apollographql/graphql-tools)
(which actually does the hard work of creating a graphql mock resolver from a
graphql schema).

To do so, create a `mock-server/graphql` directory, and put your API's schema
definition file inside of it:

```graphql
# mock-server/graphql/schema.graphql
type Query {
    greeting: String
}
schema {
    query: Query
}
```

Then write a handler for the `POST /graphql` route:

```js
// mock-server/graphql/post.js
const {readFileSync} = require("fs");
const {graphqlExpress} = require("graphql-server-express");
const graphqlTools = require("graphql-tools");

const schema = graphqlTools.makeExecutableSchema({
    typeDefs: [
        readFileSync(`${__dirname}/schema.graphql`, "utf8")
    ]
});
graphqlTools.addMockFunctionsToSchema({schema});
module.exports = graphqlExpress({schema});
```
