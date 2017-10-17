import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouteTree } from '../route-tree/route-tree';
import { NavigationLink } from '../models/navigation-link';

declare module 'rxjs/Observable' {
    interface Observable<T> {
        links: typeof links;
    }
}

function links(this: Observable<RouteTree> | Observable<Route[]>): Observable<NavigationLink[]> {
    return this.map((routes: RouteTree | Route[]) => transform(routes));

    function transform(routes: RouteTree|Route[]): NavigationLink[] {
        if (routes instanceof RouteTree) {
            return routes
                .root()
                .filter(route => route.data && route.data.title)
                .map(route => new NavigationLink(route.data.title,
                    route.data.iconCssClass,
                    route.path,
                    route.data.fullPath,
                    route.data.filledPath));
        }

        if (Array.isArray(routes)) {
            return routes
                .filter(route => route.data && route.data.title)
                .map(route => new NavigationLink(route.data.title,
                    route.data.iconCssClass,
                    route.path,
                    route.data.fullPath,
                    route.data.filledPath));
        }

        return [];
    }
}

Observable.prototype.links = links;
