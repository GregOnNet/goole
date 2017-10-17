import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { RouteTree } from './route-tree';
import { SegmentMatcher } from './segment-matcher';

@Injectable()
export class RouteTreeBuilder {

    constructor(private matcher: SegmentMatcher) { }
    tree(routes: Route[], startPath?: string) {
        if (!routes) { return new RouteTree([], this.matcher); }

        return new RouteTree(
            routes.map(route => this.mapRoute(route, startPath)),
            this.matcher
        );
    }

    private mapRoute(route: Route, pathPrefix = '') {
        const copy = Object.assign({}, route);

        copy.data = Object.assign({}, copy.data || {}, { fullPath: this.buildPath([pathPrefix, copy.path]) });
        copy.children = this.childrenOf(copy).map(c => this.mapRoute(c, copy.data.fullPath));

        return this.cleanRoute(copy);
    }

    private childrenOf(route: Route): Route[] {
        if (!route) { return []; }

        const children = route['_loadedConfig'] !== undefined
            ? route['_loadedConfig'].routes
            : route.children;

        return children === undefined
            ? []
            : children;
    }

    private buildPath(paths: string[]): string {
        return paths.filter(p => p).join('/');
    }

    private cleanRoute(route: Route): Route {
        delete route['_loadedConfig'];

        if (route.children.length === 0) {
            delete route.children;
        }

        return route;
    }
}
