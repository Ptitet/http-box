import assert from 'node:assert';
import { HTTPServer, HTTPServerEvent, RequestStatus, Router } from '../lib/lib.js';
import { describe, before, it, after } from 'node:test';

/* TODO
- cookies
- status codes
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

        router.get('/params/:param1/:param2', (req, res) => {
            res.send(req.params.param1 + req.params.param2);
            return RequestStatus.Done;
        });

        server.get('/givemecookies', (req, res) => {
            res.setCookie('cookie', 'value', { secure: true, maxAge: 666 });
            res.send('content');
            return RequestStatus.Done;
        });

        server.use('/router', router);

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
        let body = JSON.stringify({ some: 'test', object: { with: [1, 'bit', 'of'], data: true } });
        let res = await fetch(`${rootUrl}/echo`, { body, method: 'POST' });
        let resBody = await res.text();
        assert.strictEqual(resBody, body);
    });

    await it('handling of :params', async () => {
        let paramValue1 = '1234';
        let paramValue2 = 'abcd';
        let res = await fetch(`${rootUrl}/router/params/${paramValue1}/${paramValue2}`, { method: 'GET' });
        let resBody = await res.text();
        assert.strictEqual(paramValue1 + paramValue2, resBody);
    });

    await it('cookies', async () => {
        let res = await fetch(`${rootUrl}/givemecookies`);
        let [name, ...value] = res.headers.getSetCookie()[0].split('=');
        let [cookieValue, ...attributes] = value.join('=').split('; ');
        console.log(attributes);
        assert.strictEqual(name, 'cookie');
        assert.strictEqual(cookieValue, 'value');
        assert.ok(attributes.includes('Secure'));
        assert.ok(attributes.includes('Max-Age=666'));
    });

    after(() => {
        server.close();
    })
});