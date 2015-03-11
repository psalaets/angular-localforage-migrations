;(function iife(angular) {
  var module = angular.module('angular-localforage-migrations', ['LocalForageModule'])

  module.provider('migrations', migrationsProvider)

  function migrationsProvider() {
    // migration objects added by user, each has {id: number, migration: function}
    var migrations = []

    this.add = function(migration) {
      if (typeof migration.id != 'number' || migration.id <= 0) {
        throw new Error('migration.id must be a number > 0')
      }

      if (hasMigrationWithId(migration.id)) {
        throw new Error('migration already exists with id ' + migration.id)
      }

      if (typeof migration.migrate != 'function') {
        throw new Error('migration.migrate must be a function')
      }

      migrations.push(migration)
    }

    function hasMigrationWithId(id) {
      return migrations.some(function(migration) {
        return migration.id === id
      })
    }

    this.$get = ['$localForage', '$q', function($localForage, $q) {
      // localforage instance for module-private data
      var internalLocalForage = $localForage.createInstance({
        name: 'angular-localforage-migrations'
      })

      // localforage key that holds id of last migration, if any
      var lastMigrationIdKey = 'lastMigrationId'

      // fulfilled when data has been migrated
      var migrationsPromise

      return {
        migrate: runMigrations,
        $clearLastMigrationId: clearLastMigrationId,
        $setLastMigrationId: setLastMigrationId,
        $getLastMigrationId: getLastMigrationId
      }

      function runMigrations() {
        if (!migrationsPromise) {
          migrationsPromise = pendingMigrations().then(function(migrations) {
            // make a fulfilled promise to chain the migrations off of
            var migrationChain = $q.when()

            migrations.forEach(function(migration) {
              migrationChain = migrationChain.then(function() {
                return migration.migrate($localForage)
              }).then(function() {
                return setLastMigrationId(migration.id)
              })
            })

            return migrationChain
          })
        }

        return migrationsPromise
      }

      // returns promise fulfilled with array of migrations that need to be run
      function pendingMigrations() {
        return getLastMigrationId().then(function(id) {
          return migrations.filter(function(migration) {
            return migration.id > id
          })
        })
      }

      function getLastMigrationId() {
        return internalLocalForage.getItem(lastMigrationIdKey).then(function(id) {
          return id || 0
        })
      }

      function setLastMigrationId(id) {
        return internalLocalForage.setItem(lastMigrationIdKey, id)
      }

      function clearLastMigrationId() {
        return internalLocalForage.removeItem(lastMigrationIdKey)
      }
    }]
  }
})(function findAngular(window) {
  if (typeof module == 'object' && typeof module.exports == 'object') {
    // In angular < 1.3.14, require('angular') doesn't return anything useful
    // so use global angular if it's there
    return window.angular || require('angular')
  } else {
    return window.angular
  }
}(this))