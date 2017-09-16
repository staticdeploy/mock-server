## Why you should use `mock-server`

### Benefits

- during development, you won't need to start locally all the services your app
  depends on (especially useful when your backend is a fleet of microservices)
- during development, you won't need to rely on remote services (you can work
  offline!)
- you can easily simulate all of your API responses and corner cases
- you can get an idea of all the APIs your app calls just by looking into the
  `mock-server` directory

### Comparison with the alternatives

##### [json-server](https://github.com/typicode/json-server)

`mock-server` is much more flexible (non-json / non REST APIs, simulate error
conditions, etc), but much more manual (you need to write your own route
handlers).

##### [node-mock-server](https://github.com/smollweide/node-mock-server)

Again, `mock-server` is more flexible, but more manual. Also, `mock-server` has
a simpler approach which might be easier to use.

##### [service-mocker](https://github.com/service-mocker/service-mocker)

`service-mocker` has an entirely different approach, implementing the mock
server in a service worker. While this might be useful in some scenarios, it
certainly complicates things a bit. Also, `mock-server` is a bit more
_high-level_, enforcing/providing a convention to write route handlers.

##### [Mock Server](http://www.mock-server.com/) and [WireMock](http://wiremock.org/)

`mock-server` is much more primitive than Mock Server and WireMock, but also
much simpler to use. Moreover, since `mock-server` is a nodejs app, it's
probably easier to integrate in your existing frontend development
workflow/environment.
