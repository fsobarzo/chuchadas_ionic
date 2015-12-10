// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('AppCtrl', function($scope, $http){
  $scope.platform = ionic.Platform.platform();

  $http.get('http://localhost:5000'+'/users').
    success(function(data,status,headers,config){
      $scope.players = data.users
    });

  $scope.create = function(player){
    $http.post('http://localhost:5000'+'/users', player)
      .success(function(data, status, headers, config) {
        user = data.user;
        console.log(user);
      })
  }

  $scope.addChuchada = function(player){
    $http.put('http://localhost:5000'+'/users/' + player.username)
      .success(function(data, status, headers, config) {
        user = data.user;
        
      });
  }
})