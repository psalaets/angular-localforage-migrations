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
  var migrations, $rootScope, $localForage, $q

  beforeEach(function(done) {
    // set up some migrations
    angular.mock.module('angular-localforage-migrations', function(migrationsProvider) {
      migrationsProvider.add({
        id: 1,
        migrate: function($localForageArg, $qArg) {
          // check expected args passed to migrate function
          expect($localForageArg).toBe($localForage)
          expect($qArg).toBe($q)


          return $localForageArg.setItem('blah', 'foo').then(function() {
            collectedValues.push(1)
          })
        }
      })

      migrationsProvider.add({
        id: 2,
        migrate: function($localForageArg, $qArg) {
          // check expected args passed to migrate function
          expect($localForageArg).toBe($localForage)
          expect($qArg).toBe($q)

          return $localForageArg.getItem('blah').then(function() {
            collectedValues.push(2)
          })
        }
      })

      migrationsProvider.add({
        id: 3,
        migrate: function($localForageArg, $qArg) {
          // check expected args passed to migrate function
          expect($localForageArg).toBe($localForage)
          expect($qArg).toBe($q)

          return $localForageArg.getItem('blah').then(function() {
            collectedValues.push(3)
          })
        }
      })
    })

    inject(function(_migrations_, _$rootScope_, _$localForage_, _$q_) {
      migrations = _migrations_
      $rootScope = _$rootScope_
      $localForage = _$localForage_
      $q = _$q_
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
        return $localForage.clear();
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