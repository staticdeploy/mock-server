## Validating requests and responses

In order to validate requests and responses, you can define a _schema file_
alongside a handler file. The schema file contains a (~json) schema against
which the request received by the handler, and the response produced by it, are
validated.

This can be useful to catch malformed requests produced by the frontend app
calling the mock-server, and to ensure that the (usually randomly-generated)
responses produced by the mock-server match the structure the frontend app
actually expects.

### File name

The name of the file should match the format `{method}.schema.json`.

Examples:

- handler file `mock-server/get.js` -> schema file `mock-server/get.schema.json`
- handler file `mock-server/users/post.js` -> schema file
  `mock-server/users/post.schema.json`

If the file is not present no validation occurs.

### File content

A schema file contains a json object with the following properties:

- `request`: object grouping the following properties
  - `query`: json schema to validate the request query
  - `params`: json schema to validate the request params
  - `headers`: json schema to validate the request headers
  - `body`: json schema to validate the json request body
- `response`: object grouping the following properties
  - `statusCode`: json schema to validate the response status code
  - `headers`: json schema to validate the response headers
  - `body`: json schema to validate the json response body

Validation is not performed on the parts of the request/response for which there
is no json schema defined.

### Examples

#### POST /users

Given the schema file `mock-server/users/post.schema.json`:

```json
{
  "request": {
    "body": {
      "type": "object",
      "properties": {
        "name": { "type": "string" }
      },
      "required": ["name"],
      "additionalProperties": false
    }
  },
  "response": {
    "body": {
      "type": "object",
      "properties": {
        "name": { "type": "string" }
      },
      "required": ["name"],
      "additionalProperties": false
    }
  }
}
```

The following request would be ok:

```http
POST /users
{ "name": "Alice" }
```

The following request would get a `400` error:

```http
POST /users
{ "Name": "Alice" }
```

The response produced by the following handler file
(`mock-server/users/post.js`) would go through:

```js
module.exports = (req, res) => {
  res.status(201).send({
    name: req.body.name
  });
};
```

The response produced by the following handler file would be blocked, and a
`500` error would be returned instead:

```js
module.exports = (req, res) => {
  res.status(201).send({
    Name: req.body.name
  });
};
```

#### GET /users

Given the schema file `mock-server/users/get.schema.json`:

```json
{
  "request": {
    "query": {
      "type": "object",
      "properties": {
        "name": { "type": "string" }
      },
      "required": ["name"],
      "additionalProperties": false
    }
  },
  "response": {
    "body": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" }
        },
        "required": ["name"],
        "additionalProperties": false
      }
    }
  }
}
```

The following request would be ok:

```http
GET /users?name=Alice
```

The following request would get a `400` error:

```http
POST /users?Name=Alice
```

The response produced by the following handler file (`mock-server/users/get.js`)
would go through:

```js
module.exports = (req, res) => {
  res.status(200).send([
    {
      name: "Alice"
    },
    {
      name: "Bob"
    }
  ]);
};
```

The response produced by the following handler file would be blocked, and a
`500` error would be returned instead:

```js
module.exports = (req, res) => {
  res.status(201).send([
    {
      Name: "Alice"
    },
    {
      Name: "Bob"
    }
  ]);
};
```
