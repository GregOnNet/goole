import { throwIfNoValueGiven } from '../utils/validators';

export class SegmentMatcher {
    test(segments: string[], query: string[]): boolean {
        throwIfNoValueGiven(segments, 'RouteMatcher: Please provide a value for "segment".');
        throwIfNoValueGiven(query, 'RouteMatcher: Please provide a value for "query".');

        if (segments.length !== query.length) {
            return false;
        }

        return segments
            .map((segment, i) => this.match(segment, query[i]))
            .reduce((previous, current) => previous && current, true);
    }

    bestMatch(groupOfSegments: Array<string[]>, query: string[]) {
        const candidates = groupOfSegments
            .map(segments => {
                const coveringQuery = query.slice(0, segments.length);

                return {
                    isMatch: this.test(segments, query),
                    coverage: coveringQuery.length / query.length,
                    segments
                };
            })
            .filter(candidate => candidate.isMatch);

        if (!candidates || candidates.length === 0) {
            return null;
        }

        return candidates.reduce((prev, curr) => prev.coverage > curr.coverage
                                ? prev
                                : curr);
    }

    /**
     * Checks whether the segment is a parameter.
     * If the segment is a parameter the match will succeed anymway
     * If the segment is a path it will be compared with the query
     * @param segment
     * @param query
     */
    private match(segment: string, query: string): boolean {
        if (segment.indexOf(':') === 0) {
            return true;
        } else {
            return segment === query;
        }
    }
}
