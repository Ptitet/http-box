import { IncomingMessage, IncomingHttpHeaders } from 'node:http';
import { HTTPServer } from './httpServer.js';
import { HTTPMethod } from '../types.js';
import { parseRequestMethod } from '../utils.js';

export class Request {

    private _request: IncomingMessage;
    private _bodyBuilt: boolean = false;
    body: string | Buffer = Buffer.from([]);
    headers: IncomingHttpHeaders;
    method: HTTPMethod;
    url: URL;
    params: { [key: string]: string; } = {};
    query: URLSearchParams;

    constructor(request: IncomingMessage, httpServer: HTTPServer) {
        this._request = request;
        this.headers = request.headers;
        this.method = parseRequestMethod(request.method as string);
        this.url = new URL(request.url as string, `http://${httpServer.hostname}:${httpServer.port}`);
        this.query = this.url.searchParams;
    }

    private async _fetchBody() {
        for await (const chunk of this._request) {
            this.body = Buffer.concat([this.body, chunk]);
        }
    }

    private _parseBody() {
        if (this.headers['content-type'] = 'application/json') {
            this.body = JSON.parse(this.body.toString());
        }
    }

    async buildBody() {
        if (this._bodyBuilt) return;
        await this._fetchBody();
        this._parseBody();
        this._bodyBuilt = true;
    }
}