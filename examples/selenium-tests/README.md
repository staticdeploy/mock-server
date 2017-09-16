# selenium-tests example

Example of using `mock-server` when running selenium tests.

## Run the example

```sh
git clone https://github.com/staticdeploy/mock-server.git
cd mock-server/examples/selenium-tests
npm install
npm run selenium-tests
```

> Note: the first time you run `npm run selenium-tests`, the selenium binary
> (~20MB) is downloaded, so it might take a little while. Subsequent runs are
> faster.

## What happens in the example

The example uses [WebDriver.io](http://webdriver.io/) to run one selenium test
against the simple app of the [react example](../react-app). WebDriver.io
[is configured](./wdio.conf.js) to:

1. build the app
2. start a static server to serve it
3. start the mock server
4. run the selenium test in chrome

When the test is run, the app loads and calls an API mocked by the mock server.
The test assertion depends on the server response.
