if (typeof module == 'object' && module.exports) {
  // require code under test and supporting code
  window.angular = require('angular')
  require('angular-localforage')
  require('..')

  // require test stuff
  require('angular-mocks')
}

describe('migrations', function() {
  var collectedValues = []
  var migrations, $rootScope, $localForage

  beforeEach(function(done) {
    // set up some migrations
    angular.mock.module('angular-localforage-migrations', function(migrationsProvider) {
      migrationsProvider.add({
        id: 1,
        migrate: function($lf) {
          // check that $localForage is passed to migrate function
          expect($lf).toBe($localForage)

          return $lf.getItem('blah').then(function() {
            collectedValues.push(1)
          })
        }
      })

      migrationsProvider.add({
        id: 2,
        migrate: function($lf) {
          // check that $localForage is passed to migrate function
          expect($lf).toBe($localForage)

          return $lf.getItem('blah').then(function() {
            collectedValues.push(2)
          })
        }
      })
    })

    inject(function(_migrations_, _$rootScope_, _$localForage_) {
      migrations = _migrations_
      $rootScope = _$rootScope_
      $localForage = _$localForage_
    })

    collectedValues = []

    var interval = triggerDigests()
    migrations.$clearLastMigrationId().then(function() {
      stopDigests(interval)
      done()
    }, done)
  })

  describe('with no previous migrations run', function() {
    it('runs all migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([1, 2])
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

    it('runs only pending migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([2])
        done()
      }, done)
    })
  })

  describe('with all previous migrations run', function () {
    beforeEach(function(done) {
      var interval = triggerDigests()
      migrations.$setLastMigrationId(2).then(function() {
        stopDigests(interval)
        done()
      }, done)
    })

    it('runs no migrations', function(done) {
      var interval = triggerDigests()

      migrations.migrate().then(function() {
        stopDigests(interval)
        expect(collectedValues).toEqual([])
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