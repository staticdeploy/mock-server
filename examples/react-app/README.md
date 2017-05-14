# react-app example

Example of using `sd-mock-server` with a trivial react app created with
`create-react-app`.

## Run the example

```sh
git clone https://github.com/staticdeploy/sd-mock-server.git
cd sd-mock-server/examples/react-app
npm install
npm start
```

`npm start` will start, in parallel, `create-react-app`'s development server and
`sd-mock-server`.

## What happens in the example

When loaded, the app makes an http GET request to `${API_URL}/target`. While
waiting for the server response, the app shows the string `Loading`. When it
receives the response it shows the greeting `Hello ${target}!`, `target` being
the body of the response.

The value of `API_URL` can be configured by setting the `REACT_APP_API_URL`
environment variable, and it defaults to `http://localhost:3456`, ie the address
of the mock server. During development, you wouldn't set the environment
variable, so that the app sends requests to the mock server. In
staging/production instead you would set it to point to your staging/production
server.

In the example, the following options are used when starting `sd-mock-server`:

- `--watch`: starts the server in watch mode; try to change the response in
  `mock-server/target/get.js` and reload the browser
- `--delay 1000`: the server waits 1000ms before responding
- `--require babel-register`: allows to write handler files in ES201X
