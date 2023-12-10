import { Response } from './response.js';
import { Request } from './request.js';
import { Route, HandlerType, HTTPMethod, RequestStatus, HandlerFunction } from '../types.js';
import { matchPaths, cleanPath, populateRequestParams, wrapHandlerFunction } from '../utils.js';

export class Router {

    routers: Router[] = [];
    routes: Route[] = [];
    type = HandlerType.Router;
    path: string = '';
    method: HTTPMethod = HTTPMethod.Any;

    protected _handle(currentPath: string, request: Request, response: Response): RequestStatus {
        // TODO multiples routes possible qui s'enchaînent sur un même niveau
        let routeFunctions = this.routes.filter(route => {
            let doesPathsMatch = matchPaths(currentPath, route.path);
            let doesMethodsMatch = route.method === request.method || route.method === HTTPMethod.Any;
            return doesPathsMatch && doesMethodsMatch;
        });

        if (!routeFunctions.length) {
            let nextRouter = this.routers.find(router => matchPaths(currentPath, router.path));
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
            for (let routeFunction of routeFunctions) {
                request.params = populateRequestParams(currentPath, routeFunction.path);
                let status = routeFunction._handle(request, response);
                if (status !== RequestStatus.Next) return status;
            }
            let lastRouteFunctionDone = routeFunctions[routeFunctions.length - 1];
            currentPath = cleanPath(lastRouteFunctionDone.path, currentPath);
            let nextRouter = this.routers.find(router => matchPaths(currentPath, router.path));
            if (!nextRouter) {
                // 404
                response.status(404);
                response.end('Erreur 404 : la page demandée n\'a pas été trouvée (routeur)');
                return RequestStatus.Done;
            } else return nextRouter._handle(currentPath, request, response);
        }
    }

    get(path: string, handler: HandlerFunction) {
        let wrapped = wrapHandlerFunction(HTTPMethod.Get, path, handler);
        this.routes.push(wrapped);
    }

    post(path: string, handler: HandlerFunction) {
        let wrapped = wrapHandlerFunction(HTTPMethod.Post, path, handler);
        this.routes.push(wrapped);
    }

    patch(path: string, handler: HandlerFunction) {
        let wrapped = wrapHandlerFunction(HTTPMethod.Patch, path, handler);
        this.routes.push(wrapped);
    }

    delete(path: string, handler: HandlerFunction) {
        let wrapped = wrapHandlerFunction(HTTPMethod.Delete, path, handler);
        this.routes.push(wrapped);
    }

    use(path: string, handler: Router | HandlerFunction) {
        if (handler instanceof Router) {
            handler.path = path;
            this.routers.push(handler);
        } else {
            let wrapped = wrapHandlerFunction(HTTPMethod.Any, path, handler);
            this.routes.push(wrapped);
        }
    }
}