import { PathInspector } from './path-inspector';

describe('PathInspector', () => {
    let differ: PathInspector;

    beforeEach(() => differ = new PathInspector());

    describe('Extracting parameters and their values', () => {
        describe('Path consists of one parameter', () => {
            it('the name and the value of the path got extracted', () => {
                const path = ':city';
                const filledPath = 'new-york';
                const expected = [{ param: path, value: filledPath }];

                const params = differ.extractParametes(path, filledPath);

                expect(params).toEqual(expected);
            });
        });

        describe('Path contains no parameter', () => {
            it('an empty list is returned', () => {
                const path = 'new-york';
                const filledPath = 'new-york';

                const params = differ.extractParametes(path, filledPath);

                expect(params).toEqual([]);
            });
        });

        describe('Path contains a parameter', () => {
            it('the name and the value of the path got extracted', () => {
                const base = 'home';
                const param = ':city';
                const value = 'new-york';

                const path = `${base}/${param}`;
                const filledPath = `${base}/${value}`;

                const expected = [{ param, value }];

                const params = differ.extractParametes(path, filledPath);

                expect(params).toEqual(expected);
            });
        });

        describe('Path contains multiple parameters', () => {
            it('the name and the value of the path got extracted', () => {
                const base = 'home';
                const param = ':city';
                const value = 'new-york';
                const paramValue = { param, value };

                const path = `${param}/${base}/${param}/${param}`;
                const filledPath = `${value}/${base}/${value}/${value}`;

                const expected = [paramValue, paramValue, paramValue];

                const params = differ.extractParametes(path, filledPath);

                expect(params).toEqual(expected);
            });
        });
    });

    describe('Injecting paramters into a path', () => {
        describe('a path has a parameter', () => {
            it('the needed parameter is injected', () => {
                const path = ':city';
                const params = [{ param: ':city', value: 'new-york'}];

                const expected = 'new-york';

                const pathWithParams = differ.inject(params, path);

                expect(pathWithParams).toBe(expected);
            });
        });

        describe('a path has no parameter', () => {
            it('the path remains the same', () => {
                const path = 'home';
                const params = [{ param: ':city', value: 'new-york'}];

                const expected = 'home';

                const pathWithParams = differ.inject(params, path);

                expect(pathWithParams).toBe(expected);
            });
        });

        describe('a path has multiple parameters', () => {
            it('the path remains the same', () => {
                const path = 'home/:city/:street';
                const params = [
                    { param: ':city', value: 'new-york' },
                    { param: ':street', value: 'dounut-street-23' }
                ];

                const expected = 'home/new-york/dounut-street-23';

                const pathWithParams = differ.inject(params, path);

                expect(pathWithParams).toBe(expected);
            });
        });
    });
});
