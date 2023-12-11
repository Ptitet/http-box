import { HTTPServer, RequestStatus, Router } from 'http-box';

const server = new HTTPServer({ port: 5000 });

const router = new Router();

router.use('/', (req, res) => {
    req.data.time = Date.now();
    return RequestStatus.Next;
});

router.get('/time/:id', (req, res) => {
    res.send('Received at ' + req.data.time);
    console.log('ID requested : ' + req.params.id);
    return RequestStatus.Done;
});


router.get('/', (req, res) => {
    res.send('This is the root of the api');
    return RequestStatus.Done;
});

router.post('/body', (req, res) => {
    res.send('Here is the body of your request : \n');
    res.send(req.body.toString());
    return RequestStatus.Done;
});

server.use('/api', router);

server.get('/', (req, res) => {
    res.send('Welcome on website');
    return RequestStatus.Done;
});

server.start(() => console.log('Server started !'));