# angular-localforage-migrations

Migrate localForage data in an Angular app

## Usage

### 1. Depend on the `angular-localforage-migrations` module

```js
var app = angular.module('my-app', ['angular-localforage-migrations'])
```

### 2. Add migrations to `migrationsProvider` in a config block

```js
app.config(function(migrationsProvider) {
  migrationsProvider.add({
    id: 1,
    migrate: function($localForage) {
      // migrate data here and return promise
    }
  })
})
```

#### migration object passed to add()

Has required properties:

- id - Number greater than zero. The id field should increase for each migration. They do not have to be sequential and do not have to start at 1.
- migrate - Function that is passed [$localForage](https://github.com/ocombe/angular-localForage) and should return a promise.

### 3. Chain all data access off of `migrations.migrate()`

```js
app.factory('my-data-service', function(migrations, $localForage) {
  return {
    getSomeData: function() {
      return migrations.migrate().then(function() {
        return $localForage.getItem('some-data')
      })
    }
  }
})
```

#### migrations.migrate()

Returns promise fulfilled when all pending migrations have been run.

## A really basic live example

1. `git clone https://github.com/psalaets/angular-localforage-migrations.git`
2. `cd angular-localforage-migrations/example`
3. `bower install`
4. Open index.html in a browser

## Install



## License

MIT