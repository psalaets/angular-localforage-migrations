# angular-localforage-migrations

Migrate localForage data in an Angular app

## Usage

### 1. Depend on the `angular-localforage-migrations` module

```js
angular.module('my-app', ['angular-localforage-migrations'])
```

### 2. Add migrations to `migrationsProvider` in a config block

```js
angular.module('my-app').config(function(migrationsProvider) {
  migrationsProvider.add({
    id: 1,
    migrate: function($localForage) {

    }
  })
})
```

### 3. Chain all data access off of `migrations.migrate()`

```js
angular.module('my-app').factory('my-data-service', function(migrations, $localForage) {
  return {
    getSomeData: function() {
      migrations.migrate().then(function() {
        return $localForage.getItem('some-data')
      })
    }
  }
})
```

## Install



## License

MIT