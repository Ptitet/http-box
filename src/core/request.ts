import { parseCookieHeader, parseRequestMethod } from '../common/utils.js';
import type { IncomingMessage, IncomingHttpHeaders } from 'http';
import type { HTTPServer } from './server';
import type { HTTPMethod } from '../common/types';

export class Request {
    private _request: IncomingMessage;
    private _bodyBuild = false;
    body: string | Buffer = Buffer.from([]);
    headers: IncomingHttpHeaders;
    method: HTTPMethod;
    url: URL;
    params: Record<string, string> = {};
    query: URLSearchParams;
    data: Record<string, unknown> = {};
    cookies: Record<string, string>;
    timestamp: number = Date.now();

    constructor(request: IncomingMessage, httpServer: HTTPServer) {
        this._request = request;
        this.headers = request.headers;
        this.method = parseRequestMethod(request.method!);
        this.url = new URL(request.url!, `http://localhost:${httpServer.port}`); // ? use localhost as hostname or something else ?
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
            this.body = JSON.parse(this.body.toString()) as string;
        }
    }

    async buildBody() {
        if (this._bodyBuild) return;
        await this._fetchBody();
        this._parseBody();
        this._bodyBuild = true;
    }
}
