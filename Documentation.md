# API

- [class `HTTPServer`](#class-httpserver)
- [class `Router`](#class-router)
- [class `Request`](#class-request)
- [class `Response`](#class-response)
- [enum `RequestStatus`](#enum-requeststatus)
- [enum `HTTPServerEvent`](#enum-httpserverevent)
- [enum `HTTPMethod`](#enum-httpmethod)
- [enum `ContentType`](#enum-contenttype)
- [enum `HandlerType`](#enum-handlertype)
- [type `HTTPServerOptions`](#type-httpserveroptions)
- [type `Cookie`](#type-cookie)
- [type `CookieAttributes`](#type-cookieattributes)
- [type `HandlerFunction`](#type-handlerfunction)
- [type `Route`](#type-route)

# class HTTPServer

## Properties
- [`<HTTPServer>.port`](#httpserverport---number)
- [Other properties](#other-properties)

### \<HTTPServer>.port -> number
The port on which the server is listening.

### Other properties
The `HTTPServer` class extends the [`Router`](#class-router) class, please see [router properties](#properties-1) for the inherited properties.

## Methods
- [`new HTTPServer()`](#new-httpserveroptions---httpserver)
- [`<HTTPServer>.on()`](#httpserveronevent-callback---void)
- [`<HTTPServer>.start()`](#httpserverstartlisteningcallback---void)
- [`<HTTPServer>.close()`](#httpserverclose---void)
- [Other methods](#other-methods)

### new HTTPServer(options) -> HTTPServer
Creates a new HTTP server.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `options` | ?[`HTTPServerOptions`](#type-httpserveroptions) | The options for the server |

#### Example
```js
const port = 3000;
const server = new HTTPServer({ port });
```

### \<HTTPServer>.on(event, callback) -> void
Adds an event listener on the server.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
|`event`| [`HTTPServerEvent`](#enum-httpserverevent) | The event to listen for
| `callback` | function | The listener for the event

> **Notes** <br>
> Don't add listeners for `HTTPServerEvent.Request` as this event is already handled internally. <br>
> Don't add listeners for `HTTPServerEvent.Listening`, instead use the callback of [`<HTTPServer>.start()`](#httpserverstartlisteningcallback---void).

### \<HTTPServer>.start(listeningCallback) -> void
Starts the server on the port specified in the server options (see [`<HTTPServer>.port`](#httpserverport---number)).

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `listeningCallback` | function | Triggered when the server is ready |

#### Examples
```js
server.start(() => {
    console.log(`Server started at http://localhost:${port}`);
});
```

### \<HTTPServer>.close() -> void
Closes the server.

### Other methods
The `HTTPServer` class extends the [`Router`](#class-router) class, please see [router methods](#methods-1) for the inherited methods.

# class Router

## Properties
- [`<Router>.routers`](#routerrouters---router)
- [`<Router>.routes`](#routerroutes---route)
- [`<Router>.type`](#routertype---handlertyperouter)
- [`<Router>.path`](#routerpath---string)
- [`<Router>.method`](#routermethod---httpmethodany)

### \<Router>.routers -> Router[]
All the [routers](#class-router) mounted on this router.

### \<Router>.routes -> Route[]
All the handlers and their specific path and method on this router. See [`Route`](#type-route) for more details.

### \<Router>.type -> HandlerType.Router
The type of the Handler. It is always `HandlerType.Router`. See [`HandlerType`](#enum-handlertype) for more details.

### \<Router>.path -> string
The path where the router is mounted.

### \<Router>.method -> HTTPMethod.Any
The methods handled by this router. It is always `HTTPMethod.Any`. See [`HTTPMethod`](#enum-httpmethod) for more details.

## Methods

- [`new Router()`](#new-router---router)
- [`<Router>.get()`](#routergetpath-handler---void)
- [`<Router>.post()`](#routerpostpath-handler---void)
- [`<Router>.patch()`](#routerpatchpath-handler---void)
- [`<Router>.delete()`](#routerdeletepath-handler---void)
- [`<Router>.use()`](#routerusepath-handler---void)

### new Router() -> Router
Creates a new router.

### \<Router>.get(path, handler) -> void
Adds a new handler for `GET` requests.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `path` | string | The path where to add the handler |
| `handler` | [`HandlerFunction`](#type-handlerfunction) | The handler to add |

### \<Router>.post(path, handler) -> void
Adds a new handler for `POST` requests.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `path` | string | The path where to add the handler |
| `handler` | [`HandlerFunction`](#type-handlerfunction) | The handler to add |

### \<Router>.patch(path, handler) -> void
Adds a new handler for `PATCH` requests.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `path` | string | The path where to add the handler |
| `handler` | [`HandlerFunction`](#type-handlerfunction) | The handler to add |

### \<Router>.delete(path, handler) -> void
Adds a new handler for `DELETE` requests.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `path` | string | The path where to add the handler |
| `handler` | [`HandlerFunction`](#type-handlerfunction) | The handler to add |

### \<Router>.use(path, handler) -> void
Adds a new handler for any request method.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `path` | string | The path where to add the handler |
| `handler` | [`HandlerFunction`](#type-handlerfunction) \| [`Router`](#class-router) | The handler to add |

# class Request

## Properties

- [`<Request>.body`](#requestbody---string--buffer)
- [`<Request>.headers`](#requestheaders---incominghttpheaders)
- [`<Request>.method`](#requestmethod---httpmethod)
- [`<Request>.url`](#requesturl---url)
- [`<Request>.params`](#requestparams----key-string-string)
- [`<Request>.query`](#requestquery---urlsearchparams)
- [`<Request>.data`](#requestdata)
- [`<Request>.cookies`](#requestcookies----key-string-string)

### \<Request>.body -> string | Buffer
The body of the request. It is a string or a Buffer, depending on the Content-Type header.

### \<Request>.headers -> IncomingHttpHeaders
The raw headers of the request. See https://nodejs.org/docs/latest/api/http.html#messageheaders for more details.

### \<Request>.method -> HTTPMethod
The http method of the request. See [`HTTPMethod`](#enum-httpmethod) for all possible values.

### \<Request>.url -> URL
The url of the request. See https://nodejs.org/docs/latest/api/url.html#class-url for more details.

### \<Request>.params -> { [key: string]: string }
The params in the request's path.

#### Example
```js
server.get('/users/:username', (req, res) => {
    console.log(req.params.username);
    return RequestStatus.Done;
});
```
Here we declare a route with a param (`:username`). Whenever in the path of a handler there is a slash followed by a colon (`/:`), it marks a param. There can be multiple params in the same handler path, but their name must be different. The corresponding part of the request's pathname will be the value of the param.

With the previous code, if the request's pathname is `/users/jean`, `req.params.username` will be `jean`, and therefore `jean` will be logged in the console.

### \<Request>.query -> URLSearchParams
The query/search-params of the request. See https://nodejs.org/docs/latest/api/url.html#class-urlsearchparams for more details.

### \<Request>.data -> {}
This property is used to store any data you want to pass to the next handlers that will handle the request.

#### Example
```js
server.use('/*', (req, res) => {
    req.data.authenticated = false; // default to false
    if (isAuthValid(req.headers.authorization)) { // perform some auth validation
        req.data.authenticated = true; // set the auth to true if the validation success
    }
    return RequestStatus.Next;
});

server.get('/protected', (req, res) => {
    if (req.data.authenticated) { // if the validation successed
        res.send('Welcome to the protected page');
    } else { // otherwise the user is not allowed
        res.status(401);
        res.send('Invalid auth');
    }
    return RequestStatus.Done;
});
```

### \<Request>.cookies -> { [key: string]: string }
The cookies sent with the request.

# class Response

## Properties
- [`<Response>.checkContentType`](#responsecheckcontenttype---boolean)
- [`<Response>.headers`](#responseheaders---outgoinghttpheaders)
- [`<Response>.headSent`](#responseheadsent---boolean)
- [`<Response>.sent`](#responsesent---boolean)
- [`<Response>.contentType`](#responsecontenttype---contenttype)
- [`<Response>.code`](#responsecode---number)
- [`<Response>.cookies`](#responsecookies----name-string-cookie)

### \<Response>.checkContentType -> boolean
Whether or not the content-type checking when sending data is enabled. Use [`<Response>.setContentTypeCheck()`](#responsesetcontenttypecheckvalue---void) to modify this value.

### \<Response>.headers -> OutgoingHttpHeaders
The currently set headers for this reponse. The `Set-Cookie` headers are not included. To view the cookies, see [`<Response>.cookies`](#responsecookies----name-string-cookie).

### \<Response>.headSent -> boolean
Whether or not the head of the response has been sent. If true, the headers and the status code cannot be changed.

### \<Response>.sent -> boolean
Whether or not the body of the response has been sent. See [`<Response>.end()`](#responseenddata---void) for more details.

### \<Response>.contentType -> ?ContentType
The content-type of the response's body. If no data has been send yet, the value is `null`. See [`ContentType`](#enum-contenttype) for more details.

### \<Response>.code -> number
The status code of the response. By default it is `200`. Use [`<Response>.status()`](#responsestatuscode---void) to modify it.

### \<Response>.cookies -> { [name: string]: Cookie }
The cookies that have been set on this response. See [`<Response>.setCookie()`](#responsesetcookiename-value-attributes---void) for more details.

## Methods
- [`<Response>.setContentTypeCheck()`](#responsesetcontenttypecheckvalue---void)
- [`<Response>.send()`](#responsesenddata---void)
- [`<Response>.setHeader()`](#responsesetheadername-value---void)
- [`<Response>.setCookie()`](#responsesetcookiename-value-attributes---void)
- [`<Response>.status()`](#responsestatuscode---void)
- [`<Response>.end()`](#responseenddata---void)

### \<Response>.setContentTypeCheck(value) -> void
Enable or disable the content-type checking.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `value` | boolean | The new state of the content-type checking |

### \<Response>.send(data) -> void
Send some data.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | string \| Buffer | The data to send |

### \<Response>.setHeader(name, value) -> void
Set or modify a header. Do not use this to set cookies, as the last set cookie will overwrite all the other previously set. To set cookies, use [`<Response>.setCookie()`](#responsesetcookiename-value-attributes---void).

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `name` | string | The name of the header to set |
| `value` | string | The value of the header |

### \<Response>.setCookie(name, value, attributes) -> void
Set a cookie on the response.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `name` | string | The cookie's name |
| `value` | string | The cookie's value |
| `attributes` | ?[`CookieAttributes`](#type-cookieattributes) | The cookie's attributes |

### \<Response>.status(code) -> void
Set the status code of the response. See [`<Response>.code`](#responsecode---number) for more details.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `code` | number | The new status code |

### \<Response>.end(data) -> void
End the response. Optionally send data, then set [`<Response>.sent`](#responsesent---boolean) to `true`.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | ?(string \| Buffer) | The data to send before ending the response |

# enum RequestStatus
The possible status for a request in the handling process, returned by the [handler functions](#type-handlerfunction).

| Member | Description |
| ------ | ----------- |
| `RequestStatus.Done` | The request has been handled and the response is sent |
| `RequestStatus.Next` | The handler has finished his job and passes the request to the next handler |
| `RequestStatus.Error` | An error occured during the handling process |

# enum HTTPServerEvent
The different events that the server can encounter. See [`<HTTPServer>.on()`](#httpserveronevent-callback---void).

See the [Node.js documentation](https://nodejs.org/docs/latest/api/http.html#class-httpserver) for more details about each event.

| Member | Description |
| ------ | ----------- |
| `HTTPServerEvent.CheckContinue` | - |
| `HTTPServerEvent.CheckExpectation` | - |
| `HTTPServerEvent.ClientError` | - |
| `HTTPServerEvent.Close` | - |
| `HTTPServerEvent.Connect` | - |
| `HTTPServerEvent.Connection` | - |
| `HTTPServerEvent.DropRequest` | - |
| `HTTPServerEvent.Error` | - |
| `HTTPServerEvent.Listening` | - |
| `HTTPServerEvent.Request` | - |
| `HTTPServerEvent.Upgrade` | - |

> **Notes** <br>
> Don't add listeners for `HTTPServerEvent.Request` as this event is already handled internally. <br>
> Don't add listeners for `HTTPServerEvent.Listening`, instead use the callback of [`<HTTPServer>.start()`](#httpserverstartlisteningcallback---void).

# enum HTTPMethod
The different http methods handled.

| Member | Description |
| ------ | ----------- |
| `HTTPMethod.Get` | - |
| `HTTPMethod.Post` | - |
| `HTTPMethod.Patch` | - |
| `HTTPMethod.Delete` | - |
| `HTTPMethod.Any` | Special value used when [`<Router>.use()`](#routerusepath-handler---void) is called |

# enum ContentType
The different content-types.

| Member | Description |
| ------ | ----------- |
| `ContentType.Text` | Used for textual content (i.e. html) |
| `ContentType.JSON` | Used for JSON body |
| `ContentType.OctetStream` | Used for all other data types |

# enum HandlerType
The two possible types of handler.

| Member | Description |
| ------ | ----------- |
| `HandlerType.Router` | Used for [`Router`](#class-router) |
| `HandlerType.RouterFunction` | Used for [`Route`](#type-route) |

# type HTTPServerOptions
The options passed to [`new HTTPServer()`](#new-httpserveroptions---httpserver).

| Property | Type | Description |
| -------- | ---- | ----------- |
| `HTTPServerOptions.httpServer` | ?[Server](https://nodejs.org/docs/latest/api/http.html#class-httpserver) | A preexisting server object (from `node:http`) |
| `HTTPServerOptions.port` | ?number | The port on which the server listens (see [`<HTTPServer>.start()`](#httpserverstartlisteningcallback---void)) |

# type Cookie
Represents a cookie value and attributes. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie for more details.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `Cookie.value` | string | The value of the cookie |
| `Cookie.attributes` | ?[`CookieAttributes`](#type-cookieattributes) | The attributes of the cookie |

# type CookieAttributes
Represents the attributes of a cookie. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes for more details.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `CookieAttributes.secure` | ?boolean | - |
| `CookieAttributes.maxAge` | ?number | - |
| `CookieAttributes.httpOnly` | ?boolean | - |

# type HandlerFunction
Functions used to handle requests.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `request` | [`Request`](#class-request) | The incoming request |
| `response` | [`Response`](#class-response) | The outgoing response |

### Return value
[`RequestStatus`](#enum-requeststatus)

# type Route
Internal wrapper for [`HandlerFunction`](#type-handlerfunction) so they have common internally required properties with [`Router`](#class-router).

| Property | Type | Description |
| -------- | ---- | ----------- |
| `Route.path` | string | the path of the route |
| `Route.method` | [`HTTPMethod`](#enum-httpmethod) | the method this route handles |
| `Route.type` | [`HandlerType.RouterFunction`](#enum-handlertype) | the type of the route |
| `Route._handle` | [`HandlerFunction`](#type-handlerfunction) | the wrapped handler function |