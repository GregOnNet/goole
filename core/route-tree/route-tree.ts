import { Route } from '@angular/router';

import { SegmentMatcher } from './segment-matcher';
import { throwIfNoValueGiven } from '../utils/validators';


export class RouteTree {
    constructor(
        private tree: Route[],
        private matcher: SegmentMatcher) { }

    root(): Route[] {
        return this.tree;
    }

    subtree(path: string): Route {
        return this.searchInTree(path);
    }

    siblings(path: string): Route[] {
        const found = this.searchInTree(path);

        if (!found) { return null; }

        if (!found['parent']()) {
            return this.tree;
        }

        return found['parent']().children;
    }

    private searchInTree(path: string): Route {
        throwIfNoValueGiven(path, 'RouteTree: Plese provide a path ' +
            'to find in the route tree.');

        const query = path.replace(/^\//, '').split('/');
        const entryPoint = this.tree.find(subtree => this.match(subtree.path, query).isMatch);
        if (!entryPoint) {
            return null;
        }

        const candidate = this.recursiveSearch(query, entryPoint, null);

        if (!candidate) {
            return null;
        }

        candidate.data['filledPath'] = path;
        return candidate;
    }

    /**
     * Searches for child routes by the given path
     * inside the provided Route
     * @param path The path to search child entries
     * @param subtree A fragment of a route configuration
     */
    private recursiveSearch(query: string[],
        subtree: Route,
        parent: Route): Route {

        const { isMatch, tail } = this.match(subtree.path, query);

        if (isMatch && tail.length === 0) {
            subtree['parent'] = () => parent;
            return subtree;
        }

        if (!subtree.children) {
            return null;
        }

        const groupOfSegments = subtree.children.map(child => child.data.fullPath.split('/'));

        const bestMatch = this.matcher.bestMatch(groupOfSegments, query);

        let candidate = null;

        if (bestMatch) {
            candidate = subtree.children.find(branch => branch.data.fullPath === bestMatch.segments.join('/'));
        } else {
            candidate = subtree.children
                            .filter(branch => this.match(branch.path, tail).isMatch)
                            .reduce((prev, curr) => prev.path.length > curr.path.length
                                        ? prev
                                        : curr);
        }

        if (bestMatch && bestMatch.coverage === 1) {
            candidate['parent'] = () => subtree;
            return candidate;
        }

        if (tail.length > 0 && candidate) {
            candidate['parent'] = () => parent;
            return this.recursiveSearch(tail, candidate, subtree);
        }

        candidate['parent'] = () => parent;
        return candidate;
    }

    private match(segment: string, query: string[]) {
        const segments = segment.split('/');
        const coveringQuery = query.slice(0, segments.length);

        return {
            isMatch: this.matcher.test(segments, coveringQuery),
            tail: query.slice(segments.length)
        };
    }
}
