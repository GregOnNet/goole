import { Observable } from 'rxjs/Observable';
import { RouteTreeBuilder } from '../route-tree/route-tree-builder';
import { routeTreeData } from '../route-tree/route-tree.mock';
import { SegmentMatcher } from '../route-tree/segment-matcher';

import './links';

describe('(rxjs/operator) link', () => {
    let tb: RouteTreeBuilder;

    beforeAll(() => tb = new RouteTreeBuilder(new SegmentMatcher()));

    describe('Passing undefined', () => {
        it('an empty list is returnd', (done) => {
            Observable
                .of(undefined)
                .links()
                .subscribe(links => {
                    expect(links.length).toBe(0);
                    done();
                });
        });
    });

    describe('Passing a route tree', () => {
        it('all containing links are extracted', (done) => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links.length).toBe(3);
                    done();
                });
        });

        it('links having a title', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].title).toBe('Welcome');
                });
        });

        it('links having a fullPath', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].fullPath).toBe('welcome');
                });
        });

        it('links having the path set in the route configuration', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].path).toBe('welcome');
                });
        });
    });

    describe('Passing routes', () => {
        it('all containing links are extracted', (done) => {
            Observable
                .of(routeTreeData())
                .links()
                .subscribe(links => {
                    expect(links.length).toBe(3);
                    done();
                });
        });

        it('links having a title', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].title).toBe('Welcome');
                });
        });

        it('links having a fullPath', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].fullPath).toBe('welcome');
                });
        });

        it('links having the path set in the route configuration', () => {
            Observable
                .of(tb.tree(routeTreeData()))
                .links()
                .subscribe(links => {
                    expect(links[0].path).toBe('welcome');
                });
        });
    });
});
