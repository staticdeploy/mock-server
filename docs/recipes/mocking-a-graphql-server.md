## Mocking a graphql service

To mock a graphql service you can use `sd-mock-server` in combination with
[apollographql/graphql-tools](https://github.com/apollographql/graphql-tools)
(which actually does the hard work of creating a graphql mock resolver from a
graphql schema).

To do so, create a `mock-server/graphql` directory, and put your API schema
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
