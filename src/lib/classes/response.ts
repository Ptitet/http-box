import { OutgoingHttpHeaders, ServerResponse } from 'node:http';
import { ContentType, CookieAttributes, Cookie } from '../types.js';
import { getContentType, getCookieHeaderValue } from '../utils.js';

export class Response {

    private _response: ServerResponse;
    private _onSentCallbacks: (() => void)[] = [];
    checkContentType: boolean = true;
    headers: OutgoingHttpHeaders = {};
    headSent: boolean = false;
    sent: boolean = false;
    sentTimestamp: number | null = null;
    contentType: ContentType | null = null;
    code: number = 200;
    cookies: {[key: string]: Cookie} = {};

    constructor(response: ServerResponse) {
        this._response = response;
    }

    private _setContentType(data: string | Buffer) {
        this.contentType = getContentType(data);
        this.setHeader('Content-Type', this.contentType);
    }

    private _prepareCookies() {
        let headers: string[] = [];
        for (let cookieName of Object.keys(this.cookies)) {
            let cookieHeaderValue = getCookieHeaderValue(cookieName, this.cookies[cookieName]);
            headers.push(cookieHeaderValue);
        }
        this._response.setHeader('Set-Cookie', headers);
    }

    private _writeHead() {
        this._prepareCookies();
        this._response.writeHead(this.code, this.headers);
        this.headSent = true;
    }

    private _write(data: string | Buffer) {
        this._response.write(data);
    }

    private _runOnSentCallbacks() {
        for (const callback of this._onSentCallbacks) {
            callback();
        }
    }

    setContentTypeCheck(value: boolean) {
        this.checkContentType = value;
    }

    send(data: string | Buffer) {
        if (this.sent) throw new Error('Response already sent');
        if (!this.headSent) {
            this._setContentType(data);
            this._writeHead();
        }
        if (this.checkContentType) {
            let dataType = getContentType(data);
            if (dataType !== this.contentType) throw new Error(`Invalid data type : ${dataType} is not ${this.contentType}`);
        }
        this._write(data);
    }

    setHeader(name: string, value: string) {
        if (this.sent) throw new Error('Response already sent');
        if (this.headSent) throw new Error('Response head already sent');
        this.headers[name] = value;
    }

    setCookie(name: string, value: string, attributes: CookieAttributes = {}) {
        if (this.sent) throw new Error('Response already sent');
        if (this.headSent) throw new Error('Response head already sent');
        let cookie: Cookie = {
            value,
            attributes
        }
        this.cookies[name] = cookie;
    }

    status(code: number) {
        if (this.sent) throw new Error('Response already sent');
        if (this.headSent) throw new Error('Response head already sent');
        this.code = code;
    }

    end(data?: string | Buffer) {
        if (data) {
            this.send(data);
        }
        this._response.end();
        this.sentTimestamp = Date.now();
        this.sent = true;
        if (this._onSentCallbacks.length) {
            this._runOnSentCallbacks();
        }
    }

    onSent(callback: () => void) {
        this._onSentCallbacks.push(callback);
    }
}