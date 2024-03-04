# HTTP-box
HTTP-box is a lightweight http Node.js JavaScript library, inspired from [Express.js](https://expressjs.com) and its router system.

You can use it to easily setup a modular http server.

## Installation
### Regular installation
You can install HTTP-box using npm :
```sh
npm install http-box
```

### Build from source
If you want to build HTTP-box yourself, follow these steps :
- Clone this repository : `git clone https://github.com/Ptitet/http-box.git`
- Go to the root directory : `cd http-box`
- Install all the dependencies : `npm install`
- Build the library : `npm run build`

This library will be available in `dist/lib/`. The entry point of the library is `lib.js`.

## Documentation
For more details on the different apis, check the [documentation](Documentation.md).

## Usage examples
### Simple server :

```js
import { HTTPServer, RequestStatus } from 'http-box'; // or the path to lib/lib.js
const port = 3000;
const server = new HTTPServer({ port }); // create the server

server.get('/', (req, res) => {
    res.send('Welcome to the root !');
    return RequestStatus.Done; // tell the server the request has been handled
});

server.post('/echo', (req, res) => {
    let { body } = req;
    res.send(body); // send the request's body back
    return RequestStatus.Done;
});

server.start(() => console.log(`Server open at http://localhost:${port}`));
```

Here, a new server is created with the class `HTTPServer`. Then, with the `<HTTPServer>.get()` and `<HTTPServer>.post()` methods, two handlers are created, one at the root path `/` and an other at `/echo`. Finally, the server is started with `<HTTPServer>.start()`.

### Using routers :

```js
import { HTTPServer, Router, RequestStatus } from 'http-box';
const port = 3000;
const server = new HTTPServer({ port });

const apiRouter = new Router;

apiRouter.use('/', (req, res) => {
    if (isAuthValid(req)) {
        req.data.authenticated = true;
        return RequestStatus.Next; // go to the next handler
    } else {
        res.status(401);
        res.end('Bad auth');
        return RequestStatus.Done;
    }
});

apiRouter.get('/timestamp', (req, res) => {
    res.send(Date.now().toString());
    return RequestStatus.Done;
});

server.use('/api', apiRouter); // mount the router on the path /api

server.start(() => console.log(`Server open at http://localhost:${port}`));
```

The `apiRouter` is created with the class `Router`. The method `<Router>.use()` add a handler which triggers on any request at the given path, here the root `/` of the router. A handler can be a callback function, or even an entire router : the line `server.use('/api', apiRouter)` mount the api router at the route `/api` of the server. So we can access the `timestamp` route at `http://localhost:3000/api/timestamp`.