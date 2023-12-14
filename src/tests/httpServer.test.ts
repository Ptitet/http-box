import assert from 'node:assert';
import { HTTPServer, HTTPServerEvent, RequestStatus, Router } from '../lib/lib.js';
import { describe, before, it, after } from 'node:test';

/* TODO
- cookies
- :param
- status codes
- echo body
*/

await describe('test of the http server', async () => {

    const port = 3000;
    const rootUrl = `http://localhost:${port}`;
    let server: HTTPServer;

    before(() => {
        server = new HTTPServer({ port });
        const router = new Router;

        router.get('/', (req, res) => {
            res.send('router /');
            return RequestStatus.Done;
        });

        server.use('/api', router);

        server.post('/echo', (req, res) => {
            res.send(req.body);
            return RequestStatus.Done;
        });

        server.start(() => console.log('Test server launched !'));

        server.on(HTTPServerEvent.Error, e => {
            throw e;
        });
    });

    await it('echo the request body', async () => {
        let body = JSON.stringify({ some: 'test', object: { with: ['a', 'bit', 'of'], data: 123 } });
        let res = await fetch(`${rootUrl}/echo`, { body, method: 'POST' });
        let resBody = await res.text();
        assert.strictEqual(resBody, body);
    });

    after(() => {
        server.close();
    })
});