import { ContentType, HTTPMethod, HandlerFunction, HandlerType, Route } from './types.js';

export function isJSON(data: string): boolean {
    let parsed;
    try {
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

export function parseRequestMethod(requestMethod: string): HTTPMethod {
    switch (requestMethod) {
        case 'GET': return HTTPMethod.Get;
        case 'POST': return HTTPMethod.Post;
        case 'PATCH': return HTTPMethod.Patch;
        case 'DELETE': return HTTPMethod.Delete;
        default: return HTTPMethod.Any;
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
    }
}

function matchPart(handlerPart: string, requestPart: string): boolean {
    let isHandlerPartAny = handlerPart === '*';
    let isHandlerPartParameter = !!handlerPart.match(/:\w+/);
    let doesPartMatches = handlerPart.toLowerCase() === requestPart.toLowerCase();
    return isHandlerPartAny || isHandlerPartParameter || doesPartMatches;
}

export function matchPaths(currentPath: string, handlerPath: string): boolean {
    let splitRequestPath = currentPath.split('/');
    let splitHandlerPath = handlerPath.split('/');
    splitRequestPath.shift();
    splitHandlerPath.shift();
    for (let i = 0; i < splitHandlerPath.length; i++) {
        if (!matchPart(splitHandlerPath[i], splitRequestPath[i])) return false;
    }
    return true;
}

export function cleanPath(routePath: string, currentPath: string): string {
    let splitRoutePath = routePath.split('/');
    let splitCurrentPath = currentPath.split('/');
    splitRoutePath.shift();
    splitCurrentPath.shift();
    let cleanedPath = splitCurrentPath.slice(splitRoutePath.length);
    cleanedPath.unshift('');
    return cleanedPath.join('/');
}

export function populateRequestParams(currentPath: string, routePath: string): {[key: string]: string} {
    let splitRoutePath = routePath.split('/');
    let splitCurrentPath = currentPath.split('/');
    splitRoutePath.unshift();
    splitCurrentPath.unshift();
    let params: {[key: string]: string} = {};
    for (let i = 0; i < splitRoutePath.length; i++) {
        if (splitRoutePath[i].match(/:\w+/)) {
            let paramName = splitRoutePath[i].slice(1);
            let paramValue = splitCurrentPath[i];
            params[paramName] = paramValue;
        }
    }
    return params;
}