var app = angular.module('app', ['angular-localforage-migrations'])

app.config(function(migrationsProvider) {
  /*
  migrationsProvider.add({
    id: 1,
    migrate: function($localForage) {
      console.log('running migration 1')

      // create person
      return $localForage.setItem('person', {
        givenName: 'Bob',
        surname: 'Jones'
      })
    }
  })
  */

  /*
  migrationsProvider.add({
    id: 2,
    migrate: function($localForage) {
      console.log('running migration 2')

      // add age property to person
      return $localForage.getItem('person').then(function(person) {
        person.age = 40

        return $localForage.setItem('person', person)
      })
    }
  })
  */

  /*
  migrationsProvider.add({
    id: 3,
    migrate: function($localForage) {
      console.log('running migration 3')

      // convert given name and surname to full name
      return $localForage.getItem('person').then(function(person) {
        person.fullName = person.givenName + ' ' + person.surname
        delete person.givenName
        delete person.surname

        return $localForage.setItem('person', person)
      })
    }
  })
  */
})

app.factory('dataAccess', function(migrations, $localForage) {
  return {
    getPerson: function() {
      // chain data access off of migration promise
      return migrations.migrate().then(function() {
        return $localForage.getItem('person')
      })
    },
    clear: function() {
      return $localForage.clear().then(function() {
        // Not recommended: calling private-ish method for demo convenience
        return migrations.$clearLastMigrationId()
      })
    }
  }
})

app.controller('MainCtrl', function($scope, dataAccess) {
  dataAccess.getPerson().then(function(person) {
    $scope.person = person
  })

  $scope.clear = function() {
    console.log('clearing data')
    dataAccess.clear().then(function() {
      $scope.person = null
    })
  }
})