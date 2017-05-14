## User guide

Basic usage:

- create a directory `mock-server`
- place some handler files in it (read below for how to write them)
- run `sd-mock-server`

### CLI options

- `root`: mock server root directory, defaults to `mock-server`
- `port`: mock server port, defaults to `3456`
- `delay`: milliseconds to delay responses by, defaults to 0
- `watch`: boolean flag, makes the server reload on file changes
- `require`: require a module before startup, can be used multiple times

### Writing handler files

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

- the function exported by `mock-server/get.js` is registered as the handler
  for route `GET /`
- the function exported by `mock-server/users/post.js` is registered as the
  handler for route `POST /users`

You can also use route params:

- the function exported by `mock-server/users/{userId}/get.js` is registered as
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

Request bodies are parsed according to their mime-type:

- **application/json**: `req.body` is an object, the parsed json body
- **text/\***: `req.body` is as string, the body
- **application/x-www-form-urlencoded**: `req.body` is an object, the parsed
  urlencoded body
- **\*/\***: `req.body` is a buffer, the raw body
