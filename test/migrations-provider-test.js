describe('migrations provider', function () {
  var provider

  beforeEach(function () {
    module('angular-localforage-migrations', function(migrationsProvider) {
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