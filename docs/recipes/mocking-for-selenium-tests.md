## Mocking for selenium tests

One really cool use of the mock server is running it while running selenium
(browser) tests.

When you run a selenium test, a real browser is started; your app is run as if
by a real user, and it makes real http requests to its API services. As you had
to do in your local environment, you need to provide the app with access to
those services. Again, your options are:

- deploying the services in a dedicated remote environment
- start the services along with your selenium tests
- mock them (with `sd-mock-server`)

If you chose the third option, you still have to start `sd-mock-server` along
with your selenium tests, but it's probably much easier to start
`sd-mock-server` than the API services. Moreover you get the benefit of being
able to fully control API responses, allowing you to easily simulate even the
most intricate scenarios.

With the help of `sd-mock-server` running selenium tests, even in CI, becomes
almost as easy as running unit tests, as demonstrated in the
[selenium tests example](https://github.com/staticdeploy/sd-mock-server/tree/master/examples/selenium-tests).
