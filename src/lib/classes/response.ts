import { ServerResponse } from 'node:http';
import { Headers, ContentType } from '../types.js';
import { getContentType } from '../utils.js';

export class Response {

    private _response: ServerResponse;
    checkContentType: boolean = true;
    headers: Headers = {};
    headSent: boolean = false;
    sent: boolean = false;
    contentType: ContentType | null = null;
    code: number = 200;

    constructor(response: ServerResponse) {
        this._response = response;
    }

    private _setContentType(data: string | Buffer) {
        this.contentType = getContentType(data);
        this.setHeader('Content-Type', this.contentType);
    }

    private _writeHead() {
        this._response.writeHead(this.code, this.headers);
        this.headSent = true;
    }

    private _write(data: string | Buffer) {
        this._response.write(data);
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
        this.sent = true;
    }
}