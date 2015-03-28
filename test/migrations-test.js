describe('migrations', function() {
  var collectedValues = []
  var migrations, $rootScope, $localForageExpected, $qExpected

  if (typeof module == 'object' && module.exports) {
    // require code under test and supporting code
    window.angular = require('angular')
    require('angular-localforage')

    it('exposes the Angular module name through module.exports', function() {
      expect(require('..')).toBe('angular-localforage-migrations')
    })

    // require test stuff
    require('angular-mocks')
  }

  beforeEach(function(done) {
    // set up some migrations
    angular.mock.module('angular-localforage-migrations', function(migrationsProvider) {
      // migration with injections inferred
      migrationsProvider.add({
        id: 1,
        migrate: function($localForage, $q) {
          expect($localForage).toBe($localForageExpected)
          expect($q).toBe($qExpected)

          return $localForage.setItem('blah', 'foo').then(function() {
            collectedValues.push(1)
          })
        }
      })

      // migration with injections specified inline
      migrationsProvider.add({
        id: 2,
        migrate: ['$localForage', '$q', function($localForage, $q) {
          // check expected args passed to migrate function
          expect($localForage).toBe($localForageExpected)
          expect($q).toBe($qExpected)

          return $localForage.getItem('blah').then(function() {
            collectedValues.push(2)
          })
        }]
      })

      // migration with injections specified through annotation
      migrationsProvider.add({
        id: 3,
        migrate: migrate3
      })

      function migrate3($localForage, $q) {
        expect($localForage).toBe($localForageExpected)
        expect($q).toBe($qExpected)

        return $localForage.getItem('blah').then(function() {
          collectedValues.push(3)
        })
      }
      migrate3.$inject = ['$localForage', '$q']
    })

    inject(function(_migrations_, _$rootScope_, _$localForage_, _$q_) {
      migrations = _migrations_
      $rootScope = _$rootScope_
      $localForageExpected = _$localForage_
      $qExpected = _$q_
    })

    collectedValues = []

    var interval = triggerDigests()
    migrations.$clearLastMigrationId().then(function() {
      stopDigests(interval)
      done()
    }, done)
  })

  describe('with no previous migrations run', function() {
    it('should run all migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([1, 2, 3])
        done()
      }, done)
    })
  })

  describe('with some previous migrations run', function() {
    beforeEach(function(done) {
      var interval = triggerDigests()
      migrations.$setLastMigrationId(1).then(function() {
        stopDigests(interval)
        done()
      }, done)
    })

    it('should only run pending migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([2, 3])
        done()
      }, done)
    })
  })

  describe('with all previous migrations run', function () {
    beforeEach(function(done) {
      var interval = triggerDigests()
      migrations.$setLastMigrationId(3).then(function() {
        stopDigests(interval)
        done()
      }, done)
    })

    it('should run no migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([])
        done()
      }, done)
    })
  })

  describe('clearing the data of default $localForage instance', function() {
    beforeEach(function(done) {
      var interval = triggerDigests()
      migrations.$setLastMigrationId(1).then(function() {
        // if module's data wasn't namespaced this would reset last migration id
        // and it'd run more migrations than it should
        return $localForageExpected.clear();
      }).then(function() {
        stopDigests(interval)
        done()
      }, done)
    })

    it('should run the pending migrations because it is unaffected', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([2, 3])
        done()
      }, done)
    })
  })

  // taken from tests of angular-localForage
  function triggerDigests() {
    return setInterval(function() {
      $rootScope.$digest();
    }, 10)
  }

  function stopDigests(interval) {
    window.clearInterval(interval);
  }
})