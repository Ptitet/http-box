import { matchPaths, cleanPath, populateRequestParams, wrapHandlerFunction, isRequestStatus } from '../common/utils.js';
import { HandlerType, HTTPMethod, RequestStatus } from '../common/types.js';
import type { Response } from './response';
import type { Request } from './request';
import type { Route, HandlerFunction } from '../common/types';

export class Router {
    routers: Router[] = [];
    routes: Route[] = [];
    type = HandlerType.Router;
    path = '';
    method: HTTPMethod = HTTPMethod.Any;

    protected _handle(currentPath: string, request: Request, response: Response): RequestStatus {
        const routeFunctions = this.routes.filter(route => {
            const doesPathsMatch = matchPaths(currentPath, route.path);
            const doesMethodsMatch = route.method === request.method || route.method === HTTPMethod.Any;
            return doesPathsMatch && doesMethodsMatch;
        });

        if (!routeFunctions.length) {
            const nextRouter = this.routers.find(router => matchPaths(currentPath, router.path));
            if (!nextRouter) {
                // 404
                response.status(404);
                response.end('Erreur 404 : la page demandée n\'a pas été trouvée (fonction)');
                return RequestStatus.Done;
            } else {
                currentPath = cleanPath(nextRouter.path, currentPath);
                return nextRouter._handle(currentPath, request, response);
            }
        } else {
            for (const routeFunction of routeFunctions) {
                request.params = populateRequestParams(currentPath, routeFunction.path);
                const status = routeFunction._handle(request, response);
                if (!isRequestStatus(status)) throw new Error(`Handler function must return a RequestStatus, received ${typeof status}`);
                if (status !== RequestStatus.Next) return status;
            }
            const lastRouteFunctionDone = routeFunctions[routeFunctions.length - 1];
            currentPath = cleanPath(lastRouteFunctionDone.path, currentPath);
            const nextRouter = this.routers.find(router => matchPaths(currentPath, router.path));
            if (!nextRouter) {
                // 404
                response.status(404);
                response.end('Erreur 404 : la page demandée n\'a pas été trouvée (routeur)');
                return RequestStatus.Done;
            } else return nextRouter._handle(currentPath, request, response);
        }
    }

    get(path: string, handler: HandlerFunction) {
        const wrapped = wrapHandlerFunction(HTTPMethod.Get, path, handler);
        this.routes.push(wrapped);
    }

    post(path: string, handler: HandlerFunction) {
        const wrapped = wrapHandlerFunction(HTTPMethod.Post, path, handler);
        this.routes.push(wrapped);
    }

    patch(path: string, handler: HandlerFunction) {
        const wrapped = wrapHandlerFunction(HTTPMethod.Patch, path, handler);
        this.routes.push(wrapped);
    }

    delete(path: string, handler: HandlerFunction) {
        const wrapped = wrapHandlerFunction(HTTPMethod.Delete, path, handler);
        this.routes.push(wrapped);
    }

    use(path: string, handler: Router | HandlerFunction) {
        if (handler instanceof Router) {
            handler.path = path;
            this.routers.push(handler);
        } else {
            const wrapped = wrapHandlerFunction(HTTPMethod.Any, path, handler);
            this.routes.push(wrapped);
        }
    }
}
