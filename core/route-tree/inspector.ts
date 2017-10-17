import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouteTree } from './route-tree';
import { RouteTreeBuilder } from './route-tree-builder';

import { throwIfNoValueGiven } from '../utils/validators';

import 'rxjs-consecutive-operator/add';

@Injectable()
export class Inspector {
  constructor(private router: Router, private tb: RouteTreeBuilder) {
    throwIfNoValueGiven(router.config, 'Route Inspector: No route configuration was ' +
                                       'found inside the passed router instance.');
  }

  tree(): Observable<RouteTree> {
    return Observable.merge(
      Observable.of(this.tb.tree(this.router.config)),
      this.routeConfigChanges(
        this.router.events,
        () => this.tb.tree(this.router.config)));
  }

  subtree(path: string): Observable<RouteTree> {
    const tree = this.tb.tree(this.router.config);
    const subtree = tree.subtree(path);

    return Observable.merge(
      Observable.of(this.tb.tree([subtree], path)),
      this.routeConfigChanges(
        this.router.events,
        () => this.tb.tree([this.tb.tree(this.router.config).subtree(path)], path)));
  }

  private routeConfigChanges(events: Observable<Event>, after?: Function): Observable<RouteTree> {
    return events
      .filter(e => e instanceof NavigationEnd || e instanceof RouteConfigLoadEnd)
      .consecutive((a, b) => a instanceof RouteConfigLoadEnd && b instanceof NavigationEnd)
      .filter(isRouteConfigApplied => isRouteConfigApplied)
      .map(() => after());
  }
}
