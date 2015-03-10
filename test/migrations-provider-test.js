if (typeof module == 'object' && module.exports) {
  // require code under test and supporting code
  window.angular = require('angular')
  window.localforage = require('localforage')
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
  })
})