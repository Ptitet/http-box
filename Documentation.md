# API

- [class `HTTPServer`](#httpserver)
- [class `Router`](#router)
- [class `Request`](#request)
- [class `Response`](#response)
- [enum `RequestStatus`](#requeststatus)
- [enum `HTTPServerEvent`](#httpserverevent)
- [enum `HTTPMethod`](#httpmethod)
- [enum `ContentType`](#contenttype)
- [enum `HandlerType`](#handlertype)
- [type `HTTPServerOptions`](#httpserveroptions)
- [type `Cookie`](#cookie)
- [type `CookieAttributes`](#cookieattributes)
- [type `HandlerFunction`](#handlerfunction)
- [type `Route`](#route)

# HTTPServer

## Properties
- [`<HTTPServer>.port`](#httpserverport---number)
- [Other properties](#other-properties)

### \<HTTPServer>.port -> number
The port on which the server is listening.

### Other properties
The `HTTPServer` class extends the [`Router`](#router) class, please see [router properties](#properties-2) for the inherited properties.

## Methods
- [`new HTTPServer()`](#new-httpserverhttpserveroptions---httpserver)
- [`<HTTPServer>.on()`](#httpserveronhttpserverevent-callback---void)
- [`<HTTPServer>.start()`](#httpserverstartlisteningcallback---void)
- [`<HTTPServer>.close()`](#httpserverclose---void)
- [Other methods](#other-methods)

### new HTTPServer(HTTPServerOptions) -> HTTPServer
Creates a new HTTP server. The options are optional. See [`HTTPServerOptions`](#httpserveroptions) for more details on the possible options.

### \<HTTPServer>.on(HTTPServerEvent, callback) -> void
Adds an event listener on the server. See [`HTTPServerEvent`](#httpserverevent) for all the events.

Note : don't add listeners for `HTTPServerEvent.Request` as this event already handled internally.

### \<HTTPServer>.start(listeningCallback) -> void
Starts the server on the port specified in the server options (see [`<HTTPServer>.port`](#httpserverport---number)).

### \<HTTPServer>.close() -> void
Closes the server.

### Other methods
The `HTTPServer` class extends the [`Router`](#router) class, please see [router methods](#methods-1) for the inherited properties.

# Router

## Properties
- [`<Router>.routers`](#routerrouters---router)
- [`<Router>.routes`](#routerroutes---route)
- [`<Router>.type`](#routertype---handlertyperouter)
- [`<Router>.path`](#routerpath---string)
- [`<Router>.method`](#routermethod---httpmethodany)

### \<Router>.routers -> Router[]
All the routers mounted on this router.

### \<Router>.routes -> Route[]
All the handlers and their specific route and method on this router.

### \<Router>.type -> HandlerType.Router
The type of the Handler. It is always `RouterType.Router`.

### \<Router>.path -> string
The path where the router is mounted.

### \<Router>.method -> HTTPMethod.Any
The methods handled by this router. It is always `HTTPMethod.Any`. See [`HTTPMethod`](#httpmethod) for more details.

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
#### Parameters
- `path` : string -> The path where to add the handler
- `handler` : HandlerFunction -> The handler to add

### \<Router>.post(path, handler) -> void
Adds a new handler for `POST` requests.
#### Parameters
- `path` : string -> The path where to add the handler
- `handler` : HandlerFunction -> The handler to add

### \<Router>.patch(path, handler) -> void
Adds a new handler for `PATCH` requests.
#### Parameters
- `path` : string -> The path where to add the handler
- `handler` : HandlerFunction -> The handler to add

### \<Router>.delete(path, handler) -> void
Adds a new handler for `DELETE` requests.
#### Parameters
- `path` : string -> The path where to add the handler
- `handler` : HandlerFunction -> The handler to add

### \<Router>.use(path, handler) -> void
Adds a new handler for any request method.
#### Parameters
- `path` : string -> The path where to add the handler
- `handler` : HandlerFunction | Router -> The handler to add

# Request

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
The raw headers of the request. See https://nodejs.org/docs/latest/api/http.html#messageheaders.

### \<Request>.method -> HTTPMethod
The http method of the request. See [`HTTPMethod`](#httpmethod) for all possible values.

### \<Request>.url -> URL
The url of the request. See https://nodejs.org/docs/latest/api/url.html#class-url.

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
The query of the request. See https://nodejs.org/docs/latest/api/url.html#class-urlsearchparams.

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

# Response

## Properties
- [`<Response>.checkContentType`](#responsecheckcontenttype---boolean)
- [`<Response>.headers`](#responseheaders---headers)
- [`<Response>.headSent`](#responseheadsent---boolean)
- [`<Response>.sent`](#responsesent---boolean)
- [`<Response>.contentType`](#responsecontenttype---contenttype)
- [`<Response>.code`](#responsecode---number)
- [`<Response>.cookies`](#responsecookies----key-string-cookie)

### \<Response>.checkContentType -> boolean
Whether or not the content-type checking when sending data is enabled. Use [`<Response>.setContentTypeCheck()`](#responsesetcontenttypecheckvalue---void) to modify this value.

### \<Response>.headers -> OutgoingHttpHeaders
The currently set headers for this reponse. The `Set-Cookie` headers are not included. To see the cookies, see [`<Response>.cookies`](#responsecookies----key-string-cookie).

### \<Response>.headSent -> boolean
Whether or not the head of the response has been sent. If true, the headers and the status code cannot be changed.

### \<Response>.sent -> boolean
Whether or not the body of the response has been sent. See [`<Response>.end()`](#responseenddata---void).

### \<Response>.contentType -> ContentType
The content-type of the response's body. If no data has been send yet, the value is `null`.

### \<Response>.code -> number
The status code of the response. By default it is `200`. Use [`<Response>.status()`](#responsestatuscode---void) to modify it.

### \<Response>.cookies -> { [name: string]: Cookie }
The cookies that have been set on this response.

## Methods
- [`<Response>.setContentTypeCheck()`](#responsesetcontenttypecheckvalue---void)
- [`<Response>.send()`](#responsesenddata---void)
- [`<Response>.setHeader()`](#responsesetheadername-value---void)
- [`<Response>.setCookie()`](#responsesetcookiename-value-attributes---void)
- [`<Response>.status()`](#responsestatuscode---void)
- [`<Response>.end()`](#responseenddata---void)

### \<Response>.setContentTypeCheck(value) -> void
Enable or disable the content-type checking.

#### Parameters
- `value` : boolean -> the new state of the content-type checking

### \<Response>.send(data) -> void
Send some data.

#### Parameters
- `data` : string | Buffer -> the data to send

### \<Response>.setHeader(name, value) -> void
Set or modify a header. Do not use this to set cookies, as the last set cookie will overwrite all the other previously set. To set cookies, use [`<Response>.setCookie()`](#responsesetcookiename-value-attributes---void).

#### Parameters
- `name` : string -> the name of the header to set
- `value` : string -> the value of the header

### \<Response>.setCookie(name, value, attributes) -> void
Set a cookie on the response.

#### Parameters
- `name` : string -> the cookie's name
- `value` : string -> the cookie's value
- `attributes` : CookieAttributes -> the cookie's attributes

### \<Response>.status(code) -> void
Set the status code of the response. If not set, the default code `200` is used.

#### Parameters
- `code` : number -> the new status code

### \<Response>.end(data) -> void
End the response. Optionally send data, then set [`<Response>.sent`](#responsesent---boolean) to `true`.

# RequestStatus
The possible status for a request in the handling process, returned by the [handler functions](#handlerfunction)

### Values
- `RequestStatus.Done` -> the request has been handled and the response is sent
- `RequestStatus.Next` -> the handler has finished his job and passes the request to the next handler
- `RequestStatus.Error` -> an error occured during the handling process

# HTTPServerEvent
The different events that the server can encounter. See [`<HTTPServer>.on()`](#httpserveronhttpserverevent-callback---void).

See the [Node.js documentation](https://nodejs.org/docs/latest/api/http.html#class-httpserver) for more details about each event.

Note : don't add listeners for `HTTPServerEvent.Request` as this event already handled internally.

### Values
- `HTTPServerEvent.CheckContinue`
- `HTTPServerEvent.CheckExpectation`
- `HTTPServerEvent.ClientError`
- `HTTPServerEvent.Close`
- `HTTPServerEvent.Connect`
- `HTTPServerEvent.Connection`
- `HTTPServerEvent.DropRequest`
- `HTTPServerEvent.Error`
- `HTTPServerEvent.Listening`
- `HTTPServerEvent.Request`
- `HTTPServerEvent.Upgrade`

# HTTPMethod
The different http methods handled.

### Values
- `HTTPMethod.Get`
- `HTTPMethod.Post`
- `HTTPMethod.Patch`
- `HTTPMethod.Delete`
- `HTTPMethod.Any` -> used when [`<Router>.use()`](#routerusepath-handler---void) is called

# ContentType
The different content-types.

### Values
- `ContentType.Text`
- `ContentType.JSON`
- `ContentType.OctetStream`

# HandlerType
The two types of handler possible

### Values
- `HandlerType.Router`
- `HandlerType.RouterFunction`

# HTTPServerOptions
The options passed to [`new HTTPServer()`](#new-httpserverhttpserveroptions---httpserver)

### Values
- `HTTPServerOptions.httpServer` : Server -> a preexisting server object (from `node:http`)
- `HTTPServerOptions.port` : number -> the port on which the server listens

# Cookie
Represents a cookie value and attributes

### Values
- `Cookie.value` : string -> the value of the cookie
- `Cookie.attributes` : CookieAttributes -> the attributes of the cookie

# CookieAttributes
Represents the attributes of a cookie.

### Values
- `CookieAttributes.secure` : boolean
- `CookieAttributes.maxAge` : number
- `CookieAttributes.httpOnly` : boolean

# HandlerFunction
Functions used to handle requests.

### Parameters
- `request` : Request -> the incoming request
- `response` : Reponse -> the outgoing response

### Return value
RequestStatus

# Route
Internal wrapper for HandlerFunctions so they have common internally required properties with routers.

### Values
- `Route.path` : string -> the path of the route
- `Route.method` : HTTPMethod -> the method this route handles
- `Route.type` : HandlerType.RouterFunction -> the type of the route
- `Route._handle` : HandlerFunction -> the wrapped handler function