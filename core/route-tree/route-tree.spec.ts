
import { Route } from '@angular/router';

import { RouteTree } from './route-tree';
import { SegmentMatcher } from './segment-matcher';
import { routeTreeData } from './route-tree.mock';

describe('RouteTree', () => {
    let tree: RouteTree;

    beforeEach(() => {
        tree = new RouteTree(routeTreeData(), new SegmentMatcher());
    });

    describe('The root of the tree is requests', () => {
        it('yields the root elements of the tree', () => {
            expect(tree.root().length).toEqual(4);
        });
    });

    describe('No path to the subtree is provided', () => {
        it('fails', () => {
            const expectedErr = 'RouteTree: Plese provide a path ' +
                'to find in the route tree.';

            expect(() => tree.subtree(undefined)).toThrowError(expectedErr);
        });
    });

    describe('Subtree is not found', () => {
        it('null is returned', () => {
            const path = 'does/not/exist/in/route/tree';
            expect(tree.subtree(path)).toBeNull();
        });
    });

    describe('Subtree is found', () => {
        let path: string;
        let foundTree, expectedTree: Route;

        beforeAll(() => {
            path = 'administration/users';
            expectedTree = routeTreeData()[3].children[2];
            tree = new RouteTree(routeTreeData(), new SegmentMatcher());

            foundTree = tree.subtree(path);
        });

        it('yields the subtree', () => {
            expect(foundTree.data.fullPath).toEqual(expectedTree.data.fullPath);
        });

        it('the items of the subtree know their parent', () => {
            expect(foundTree.parent().path).toBe('administration');
        });
    });

    describe('Subtree is found nested in the tree', () => {
        it('yields the subtree', () => {
            const path = 'administration/confidential';
            const expected = routeTreeData()[3].children[3].data.fullPath;

            const foundTree = tree.subtree(path);

            expect(foundTree.data.fullPath).toEqual(expected);
        });
    });

    describe('Route has siblings', () => {
        it('the returned RouteTree contains all siblings of the route', () => {
            const siblings = tree.siblings('administration/dashboard');
            expect(siblings[2].path).toBe('users');
        });

        it('the returned RouteTree contains the route itself', () => {
            const siblings = tree.siblings('administration/dashboard');
            expect(siblings[1].data.fullPath).toEqual('administration/dashboard');
        });
    });

    describe('Parsing route having parameters', () => {
        it('the parameter is treated as placeholder and yields siblings', () => {
            const siblings = tree.siblings('administration/user/49FJNDASJ328');
            expect(siblings[1].data.fullPath).toBe('administration/dashboard');
        });

        it('a property is provided providing the path filled with parameters', () => {
            const siblings = tree.siblings('administration/user/49FJNDASJ328');
            expect(siblings[4].data.filledPath).toBe('administration/user/49FJNDASJ328');
        });
    });
});

