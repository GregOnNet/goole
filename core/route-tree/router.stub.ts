import { Event, Route, RouteConfigLoadEnd, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class RouterStub {
  config: Route[] = [];
  events$: Subject<Event>;

  constructor() {
    this.events$ = new Subject();
  }

  get events(): Observable<Event> {
    return this.events$.asObservable();
  }

  propagateUpdatedConfig(loadedConfig: Route[]) {
      this.config = loadedConfig;
      this.events$.next(new RouteConfigLoadEnd({}));
      this.events$.next(new NavigationEnd(1, 'somewhere', 'somewhere'));
  }
}
