import { Server } from 'node:http';
import { Response } from './classes/response.js';
import { Request } from './classes/request.js';

export enum RequestStatus {
    Done = 'done',
    Next = 'next',
    Error = 'error'
}

export enum HTTPMethod {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Delete = 'DELETE',
    Any = 'ANY'
}

export enum ContentType {
    Text = 'text/html',
    JSON = 'application/json',
    OctetStream = 'application/octet-stream'
}

export type Headers = {
    [key: string]: string
}

export type HandlerFunction = (request: Request, response: Response) => RequestStatus;

export type Route = {
    path: string,
    method: HTTPMethod,
    type: HandlerType.RouterFunction,
    _handle: HandlerFunction
}

export enum HandlerType {
    Router,
    RouterFunction
}

export type HTTPServerOptions = {
    httpServer?: Server,
    port?: number
}

export enum HTTPServerEvent {
    CheckContinue = 'checkContinue',
    CheckExpectation = 'checkExpectation',
    ClientError = 'clientError',
    Close = 'close',
    Connect = 'connect',
    Connection = 'connection',
    DropRequest = 'dropRequest',
    Error = 'error',
    Listening = 'listening',
    Request = 'request',
    Upgrade = 'upgrade'
}

export type CookieAttributes = {
    [key: string]: number | boolean | undefined,
    secure?: boolean,
    maxAge?: number,
    httpOnly?: boolean
}

export type Cookie = {
    value: string,
    attributes: CookieAttributes
}