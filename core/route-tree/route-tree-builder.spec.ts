import { Route } from '@angular/router';

import { RouteTreeBuilder } from './route-tree-builder';
import { SegmentMatcher } from './segment-matcher';

describe('RouteTreeBuilder', () => {
    let oneChild: Route[];
    let builder: RouteTreeBuilder;

    beforeEach(() => {
        oneChild = [{ path: 'administration', children: [{ path: 'user', data: { title: 'Adm' } }] }];
        builder = new RouteTreeBuilder(new SegmentMatcher());
    });

    describe('Mapping a route configuration having one child', () => {
        it('the property fullPath contains the parent and current route segment', () => {
            const tree = builder.tree(oneChild);
            expect(tree.subtree('administration').children[0].data.fullPath).toEqual('administration/user');
        });

        it('does not override existing data properties of the route', () => {
            const tree = builder.tree(oneChild);
            expect(tree.subtree('administration').children[0].data.title).toEqual('Adm');
        });
    });
});
