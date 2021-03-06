# Change Log

All notable changes to this project will be documented in this file.

## [3.1.0] - 2015-03-28
### Changed

- `require('angular-localforage-migrations')` now returns the Angular module name so commonjs users can do
```js
angular.module('app', [require('angular-localforage-migrations')])
```

## [3.0.0] - 2015-03-15
### Changed

- `migrate` functions are now fully injectable using [typical Angular conventions](https://docs.angularjs.org/guide/di#dependency-annotation)

## [2.2.0] - 2015-03-12
### Added

- Accept optional namespace prefix for the module-private localForage instance. This is needed when running multiple instances of `angular-localforage-migrations` on the same domain. Defaults to empty string.

## [2.1.0] - 2015-03-12
### Added

- Pass `$q` as 2nd parameter to `migrate` functions.

## [2.0.0] - 2015-03-10
### Changed

- Use a namespaced, module-private localForage instance to track migration progress. Calling `localforage.clear()` no longer deletes the migration tracking data.

## [1.0.0] - 2015-03-10
### Added

- Migration execution
- Keep track of migration progress
- CommonJS support