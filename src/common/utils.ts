import { HTTPMethod, ContentType, HandlerType, RequestStatus } from './types.js';
import type { Cookie, HandlerFunction, Route } from './types';

export function isJSON(data: string): boolean {
    let parsed;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parsed = JSON.parse(data);
    } catch {
        return false;
    }
    return typeof parsed === 'object' && parsed !== null;
}

export function removeTrailingSlash(path: string) {
    if (path.length === 1) return path;
    if (path.endsWith('/')) return path.slice(0, -1);
    return path;
}

function isPartOfEnum<Enum extends object>(value: unknown, enumObject: Enum): value is Enum {
    return Object.values(enumObject).includes(value as Enum);
}

export function parseRequestMethod(requestMethod: string): HTTPMethod {
    if (!isPartOfEnum(requestMethod, HTTPMethod)) {
        return HTTPMethod.Any;
    } else {
        return HTTPMethod[requestMethod as keyof typeof HTTPMethod];
    }
}

export function getContentType(data: string | Buffer) {
    if (Buffer.isBuffer(data)) return ContentType.OctetStream;
    if (isJSON(data)) return ContentType.JSON;
    return ContentType.Text;
}

export function wrapHandlerFunction(method: HTTPMethod, path: string, handlerFunction: HandlerFunction): Route {
    return {
        path,
        _handle: handlerFunction,
        type: HandlerType.RouterFunction,
        method
    };
}

function matchPart(handlerPart: string, requestPart?: string): boolean {
    const isHandlerPartAny = handlerPart === '*';
    const isHandlerPartParameter = !!handlerPart.match(/:\w+/);
    const doesPartMatches = handlerPart.toLowerCase() === requestPart?.toLowerCase();
    return isHandlerPartAny || isHandlerPartParameter || doesPartMatches;
}

export function matchPaths(currentPath: string, handlerPath: string): boolean {
    const splitRequestPath = currentPath.split('/');
    const splitHandlerPath = handlerPath.split('/');
    splitRequestPath.shift();
    splitHandlerPath.shift();
    for (let i = 0; i < splitHandlerPath.length; i++) {
        if (!matchPart(splitHandlerPath[i], splitRequestPath[i])) return false;
    }
    return true;
}

export function cleanPath(routePath: string, currentPath: string): string {
    const splitRoutePath = routePath.split('/');
    const splitCurrentPath = currentPath.split('/');
    splitRoutePath.shift();
    splitCurrentPath.shift();
    const cleanedPath = splitCurrentPath.slice(splitRoutePath.length);
    cleanedPath.unshift('');
    return cleanedPath.join('/') || '/';
}

export function populateRequestParams(currentPath: string, routePath: string): Record<string, string> {
    const splitRoutePath = routePath.split('/');
    const splitCurrentPath = currentPath.split('/');
    splitRoutePath.unshift();
    splitCurrentPath.unshift();
    const params: Record<string, string> = {};
    for (let i = 0; i < splitRoutePath.length; i++) {
        if (splitRoutePath[i].match(/:\w+/)) {
            const paramName = splitRoutePath[i].slice(1);
            const paramValue = splitCurrentPath[i];
            params[paramName] = paramValue;
        }
    }
    return params;
}

export function isRequestStatus(value: unknown): value is RequestStatus {
    return Object.values(RequestStatus).includes(value as RequestStatus);
}

export function parseCookieHeader(cookieHeader: string) {
    const cookiePairs = cookieHeader.split('; ');
    const cookies: Record<string, string> = {};
    for (const cookie of cookiePairs) {
        const [name, value] = cookie.split('=');
        cookies[name] = value;
    }
    return cookies;
}

function isBoolean(value: unknown) {
    return typeof value === 'boolean';
}

const cookieAttributesMap = new Map(Object.entries({
    secure: 'Secure',
    maxAge: 'Max-Age',
    httpOnly: 'Http-Only'
}));

export function getCookieHeaderValue(cookieName: string, cookie: Cookie): string {
    let headerValue = `${cookieName}=${cookie.value}`;
    for (const attributeName of Object.keys(cookie.attributes)) {
        const attribute = cookie.attributes[attributeName];
        if (isBoolean(attribute) && attribute) headerValue += `; ${cookieAttributesMap.get(attributeName)}`;
        else if (attribute) headerValue += `; ${cookieAttributesMap.get(attributeName)}=${attribute}`;
    }
    return headerValue;
}
