import { Inspector } from './inspector';
import { RouteTreeBuilder } from './route-tree-builder';
import { RouterStub } from './router.stub';

import { routeTreeData } from './route-tree.mock';
import { SegmentMatcher } from './segment-matcher';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skip';
import 'rxjs-consecutive-operator/add';

describe('Inspector', () => {
    let inspector: Inspector;
    let builder: RouteTreeBuilder;
    let router;
    let initialConfig;

    beforeEach(() => {
        router = new RouterStub();
        initialConfig = [{ path: 'administration', _loadedConfig: { routes: [{ path: 'users' }] } }];
        router.config = initialConfig;

        builder = new RouteTreeBuilder(new SegmentMatcher());
        inspector = new Inspector(router, builder);
    });

    describe('Subscribing to the whole route configuration', () => {
        it('yields the current RouteTree', (done) => {
            inspector
                .tree()
                .subscribe(tree => {
                    expect(tree).toBeDefined();
                    done();
                });
        });
    });

    describe('Updating the route configuration', () => {
        it('yields the updated RouteTree', (done) => {
            router.config = initialConfig;

            inspector
                .tree()
                .skip(1)
                .subscribe(tree => {
                    expect(tree.subtree('administration').children[1].data.fullPath).toEqual('administration/dashboard');
                    done();
                });

            router.propagateUpdatedConfig(routeTreeData());
        });
    });

    describe('Subscribing to a subtree of the configuration', () => {
        it('the subscriber gets updates for the subtree', (done) => {
            router.config = initialConfig;

            const expectedSubtree = builder.tree([routeTreeData()[3]]);

            inspector
                .subtree('administration')
                .skip(1)
                .subscribe(subtree => {
                    expect(expectedSubtree.root()[0].children.length).toBe(subtree.root()[0].children.length);
                    done();
                });

            router.propagateUpdatedConfig(routeTreeData());
        });
    });

    describe('Without lazy loaded modules', () => {
        it('the initial route configuration is provided', (done) => {
            inspector
                .tree()
                .subscribe(tree => {
                    expect(tree).toBeDefined();
                    done();
                });
        });
    });

    describe('No router config provided', () => {
        it('fails', () => {
            const routerWithoutConfig: any = new RouterStub();

            expect(() => new Inspector(routerWithoutConfig, builder))
                .toThrowError('Route Inspector: No route configuration was found ' +
                'inside the passed router instance.');
        });
    });
});
