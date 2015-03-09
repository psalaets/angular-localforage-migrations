// global assumed: localforage, angular, jasmine stuff
describe('migrations', function() {
  var collectedValues = []
  var migrations, $rootScope, $localForage

  beforeEach(function(done) {
    // set up some migrations
    module('angular-localforage-migrations', function(migrationsProvider) {
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
    localforage.clear(done)
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
      localforage.setItem('angular-localforage-migrations:lastMigrationId', 1, done)
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
      localforage.setItem('angular-localforage-migrations:lastMigrationId', 2, done)
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