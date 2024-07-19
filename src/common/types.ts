import type { Server } from 'http';
import type { Response } from '../core/response';
import type { Request } from '../core/request';

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

export type HandlerFunction = (request: Request, response: Response) => RequestStatus;

export interface Route {
    path: string;
    method: HTTPMethod;
    type: HandlerType.RouterFunction;
    _handle: HandlerFunction;
}

export enum HandlerType {
    Router,
    RouterFunction
}

export interface HTTPServerOptions {
    httpServer?: Server;
    port?: number;
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

export interface CookieAttributes {
    [key: string]: number | boolean | undefined;
    secure?: boolean;
    maxAge?: number;
    httpOnly?: boolean;
}

export interface Cookie {
    value: string;
    attributes: CookieAttributes;
}
