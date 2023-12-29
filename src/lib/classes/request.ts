import { IncomingMessage, IncomingHttpHeaders } from 'node:http';
import { HTTPServer } from './httpServer.js';
import { HTTPMethod } from '../types.js';
import { parseCookieHeader, parseRequestMethod } from '../utils.js';

export class Request {

    private _request: IncomingMessage;
    private _bodyBuild: boolean = false;
    body: string | Buffer = Buffer.from([]);
    headers: IncomingHttpHeaders;
    method: HTTPMethod;
    url: URL;
    params: { [key: string]: string; } = {};
    query: URLSearchParams;
    data: any = {};
    cookies: { [key: string]: string };

    constructor(request: IncomingMessage, httpServer: HTTPServer) {
        this._request = request;
        this.headers = request.headers;
        this.method = parseRequestMethod(request.method as string);
        this.url = new URL(request.url as string, `http://localhost:${httpServer.port}`); // ? use localhost as hostname or something else ?
        this.query = this.url.searchParams;
        if (request.headers.cookie) this.cookies = parseCookieHeader(request.headers.cookie);
        else this.cookies = {};
    }

    private async _fetchBody() {
        for await (const chunk of this._request) {
            this.body = Buffer.concat([this.body, chunk]);
        }
    }

    private _parseBody() {
        if (this.headers['content-type'] === 'application/json') {
            this.body = JSON.parse(this.body.toString());
        }
    }

    async buildBody() {
        if (this._bodyBuild) return;
        await this._fetchBody();
        this._parseBody();
        this._bodyBuild = true;
    }
}