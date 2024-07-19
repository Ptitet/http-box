import { Server } from 'http';
import { Request } from './request.js';
import { Response } from './response.js';
import { Router } from './router.js';
import { removeTrailingSlash } from '../common/utils.js';
import { type HTTPServerOptions, HTTPServerEvent } from '../common/types.js';

export class HTTPServer extends Router {
    private _httpServer: Server;
    port: number;

    constructor(options?: HTTPServerOptions) {
        super();
        this._httpServer = options?.httpServer ?? new Server();
        this.port = options?.port ?? 80;

        this._setup();
    }

    private _setup() {
        this._httpServer.on(HTTPServerEvent.Request, (req, res) => {
            const request = new Request(req, this);
            const requestBodyBuilt = request.buildBody();
            const response = new Response(res);
            const path = removeTrailingSlash(request.url.pathname);
            void requestBodyBuilt.then(() => {
                this._handle(path, request, response);
                if (!response.sent) {
                    response.end();
                }
            });
        });
    }

    on(event: HTTPServerEvent, callback: (...args: unknown[]) => void) {
        this._httpServer.on(event, callback);
    }

    start(listeningCallback: () => void) {
        this._httpServer.listen(this.port, listeningCallback);
    }

    close() {
        this._httpServer.close();
    }
}
