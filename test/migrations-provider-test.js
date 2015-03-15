if (typeof module == 'object' && module.exports) {
  // require code under test and supporting code
  window.angular = require('angular')
  require('angular-localforage')
  require('..')

  // require test stuff
  require('angular-mocks')
}

describe('migrations provider', function () {
  var provider

  beforeEach(function () {
    angular.mock.module('angular-localforage-migrations', function(migrationsProvider) {
      provider = migrationsProvider
    })
  })

  describe('#add', function () {
    it('does not accept migrations with non-numeric id', inject(function () {
      expect(function() {
        provider.add({
          id: 'string id',
          migrate: function() {}
        })
      }).toThrow()
    }))

    it('does not accept migrations with a duplicate id', inject(function () {
      provider.add({
        id: 1,
        migrate: function() {}
      })

      expect(function() {
        provider.add({
          id: 1,
          migrate: function() {}
        })
      }).toThrow()
    }))

    it('does not accept migrations with no migrate function', inject(function () {
      expect(function() {
        provider.add({
          id: 1
        })
      }).toThrow()
    }))

    it('accepts migrations with migrate function', inject(function () {
      provider.add({
        id: 1,
        migrate: function(dep) {}
      })
    }))

    it('accepts migrations with migrate array', inject(function () {
      provider.add({
        id: 1,
        migrate: ['dep', function(dep) {}]
      })
    }))

    it('does not accept non-strings for internal namespace', inject(function() {
      expect(function() {
        provider.setInternalNamespace(5)
      }).toThrow()
    }))
  })
})