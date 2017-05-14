## Using compile-to-js languages

It's possible to write handler files in a compile-to-js language by simply
writing the files in that language and registering a require hook when starting
`sd-mock-server`.

### Babel example

* write a `.babelrc` in the mock-server root:
  ```json
  // mock-server/.babelrc
  {
      "presets": ["env"]
  }
  ```
  > Note: if you already have a `.babelrc` in your project's root, you can make
  > `sd-mock-server` use that by simply not writing a `.babelrc` in the
  > mock-server root.

* write your handler files:
  ```js
  // mock-server/get.js
  export default function handler (req, res) {
      req.status(200).send("OK");
  }
  ```

* install `babel-register` and start the server with
  `sd-mock-server --require babel-register`

### TypeScript example

* write your handler files:
  ```typescript
  // mock-server/get.ts
  import {RequestHandle} from "express";

  const handler: RequestHandler = (req, res) => {
      req.status(200).send("OK");
  };
  export default handler;
  ```

* install `ts-node` and start the server with
  `sd-mock-server --require ts-node/register`
