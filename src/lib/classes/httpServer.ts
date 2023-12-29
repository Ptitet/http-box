import { Server } from 'http';
import { HTTPServerOptions, HTTPServerEvent } from '../types.js';
import { Request } from './request.js';
import { Response } from './response.js';
import { Router } from './router.js';
import { removeTrailingSlash } from '../utils.js';

export class HTTPServer extends Router {

    private _httpServer: Server;
    port: number;

    constructor(options?: HTTPServerOptions) {
        super();
        this._httpServer = options?.httpServer || new Server;
        this.port = options?.port || 80;

        this._setup();
    }

    private _setup() {
        this._httpServer.on(HTTPServerEvent.Request, async (req, res) => {
            let request = new Request(req, this);
            await request.buildBody();
            let response = new Response(res);
            let path = removeTrailingSlash(request.url.pathname);
            this._handle(path, request, response);
            if (!response.sent) {
                response.end();
            }
        });
    }

    on(event: HTTPServerEvent, callback: (...args: any[]) => void) {
        this._httpServer.on(event, callback);
    }

    start(listeningCallback: () => void) {
        this._httpServer.listen(this.port, listeningCallback);
    }

    close() {
        this._httpServer.close();
    }
}