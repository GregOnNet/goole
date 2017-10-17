## Goole
> Inspect your route configuration

This library tracks the route configuration of an [Angular](https://angular.io) application. Even lazy loaded routes which are added to the configuration at an indefinite time are noticed by Goole.

## Not ready for production

This code is extracted from another project.
It is still needed to transform the logic into an angular library.

## Why Goole

At some point it becomes hard to manually update navigation items in a large application.
For example imagine an app with submenus.
It would be cool to have a central place configuring navigation items.
Each `route` possibly could be used as a link 

Goole reads the configuration and provides updates when the routes configuration has changed.

This enables you to read every property from each route, getting it's children or siblings.

It is also possible to read the `data` attribute providing additional information. For example you could place a title or an icon if you want to use Goole dynamically creating a navigation for you.

## How to use

To be able to use the route inspector you are forced to copy the code of this repository.
As soon as I created a library for it you will be able to install this package via npm.

## Have a look at the tests

Since this documentation is not complete please refer to the unit tests.
For example there is a helper called `PathInspector` helping you to parse a route and extract or inject parameters into a pat.

```typescript
// path-inspector.spec.ts

// inject parameters
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
```

## Example
> :warning: The following sample is not tested in an app. It just illustrates the Goole's concept.

- You need to include the `CoreModule` into your app to setup every thing. 

### Basic

```typescript
// some.component.ts

@Constructor({ /* ... */})
export class SomeComponent {
  constructor(private goole: Inspector) {}

  rootTree() {
    this.goole
      .tree()
      .subscribe((tree: RouteTree) => {
        tree.root(); // => Whole tree
        tree.subtree('child/path'); // => searches for subtree matching given path.
        tree.siblings(); // => routes in the same level
      })
  }

  subtree() {
    this.goole
      .subtree('child/path')
      .subscribe((tree: RouteTree) => {
        /* ... */
      })
  }
}
```

### link operator

There is an operator available filtering the route tree.
The operator `link` will look for a `title` inside `data` property of a `Route`.
A given `title` indicates that the route is ment to be a navigation item.

So it gets easy to find all navigation items in your route configuration. 