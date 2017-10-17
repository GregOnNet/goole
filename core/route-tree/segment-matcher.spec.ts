import { SegmentMatcher } from './segment-matcher';

describe('SegmentMatcher', () => {
    let matcher: SegmentMatcher;

    beforeEach(() => {
        matcher = new SegmentMatcher();
    });

    describe('Match single route', () => {
        describe('Given segment and query have equal values', () => {
            it('yields true', () => {
                const segments = ['new-york'];
                const query = ['new-york'];

                expect(matcher.test(segments, query)).toBeTruthy();
            });
        });

        describe('Given parameters have no value', () => {
            it('an error is thrown if "segment" has no value', () => {
                expect(() => matcher.test(undefined, ['some'])).toThrowError('RouteMatcher: Please provide a value for "segment".');
            });

            it('an error is thrown if "query" has no value', () => {
                expect(() => matcher.test(['some'], [])).toThrowError('RouteMatcher: Please provide a value for "query".');
            });
        });

        describe('Given segment and query have different values', () => {
            it('yields false', () => {
                const segments = ['new-york'];
                const query = ['washington'];

                expect(matcher.test(segments, query)).toBeFalsy();
            });
        });

        describe('Given segment and query have different length', () => {
            it('yields false', () => {
                const segments = ['new', 'york', 'city'];
                const query = ['new', 'york'];

                expect(matcher.test(segments, query)).toBeFalsy();
            });
        });

        describe('Given segment defines a parameter', () => {
            it('the query matches tha parameter', () => {
                const segments = ['new-york', ':userID'];
                const query = ['new-york', '23DJ-S32-43S'];

                expect(matcher.test(segments, query)).toBeTruthy();
            });
        });

        describe('Given segment is a parameter', () => {
            it('the query matches tha parameter', () => {
                const segments = [':userID'];
                const query = ['23DJ-S32-43S'];

                expect(matcher.test(segments, query)).toBeTruthy();
            });
        });

        describe('Given segments start with a parameter having wron path', () => {
            it('yields false', () => {
                const segments = [':userID', 'roles'];
                const query = ['23DJ-S32-43S', 'some-other'];

                expect(matcher.test(segments, query)).toBeFalsy();
            });
        });
    });

    describe('Get the best match of multiple routes', () => {
        describe('Given two routes where one fits more than the other', () => {
            describe('First route has more similarity with the query', () => {
                it('The first route is returned', () => {
                    const segments = [
                        ['program', ':programGuid', 'delivery-list'],
                        ['program', ':programGuid']
                    ];

                    const query = ['program', '2342-93204-ASD', 'delivery-list'];

                    expect(matcher.bestMatch(segments, query).segments).toBe(segments[0]);
                });
            });

            describe('Second route has more similarity with the query', () => {
                it('The second route is returned', () => {
                    const segments = [
                        ['program', ':programGuid'],
                        ['program', ':programGuid', 'delivery-list']
                    ];

                    const query = ['program', '2342-93204-ASD', 'delivery-list'];

                    expect(matcher.bestMatch(segments, query).segments).toBe(segments[1]);
                });
            });
        });

        describe('Program related routes', () => {
            describe('Request program/:programGuid/deliverylist', () => {
                let segments;
                let query;
                let bestMatch;

                it('yields deliverylist/', () => {
                    segments = [
                        ['program', ':programGuid'],
                        ['program', ':programGuid', 'deliverylist'],
                        ['program', ':programGuid', 'delivery'],
                        ['program', ':programGuid', 'roles']
                    ];

                    query = ['program', '2342-93204-ASD', 'deliverylist'];

                    bestMatch = matcher.bestMatch(segments, query);

                    expect(bestMatch.segments).toBe(segments[1]);
                });

                it('program/:programGuid/roles is no match', () => {
                    segments = [
                        ['program', ':programGuid', 'roles']
                    ];

                    query = ['program', '2342-93204-ASD', 'delivery-list'];

                    bestMatch = matcher.bestMatch(segments, query);

                    expect(bestMatch).toBeNull();
                });
            });
        });
    });
});
