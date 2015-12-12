// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var mainIonic  = angular.module('starter', ['ionic']);

mainIonic.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('tabs',{
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/base.html'
    })
    .state('tabs.home',{
      url: '/home',
      views:{
        'home-tab':{
          templateUrl: '/templates/home.html',
          controller: 'HomeController'
        }
      }
    })
    .state('tabs.history',{
      url: '/history',
      views: {
        'history-tab': {
          templateUrl: '/templates/history.html',
          controller: 'HistoriesController'
        }
      }
    })
    .state('tabs.charges',{
      url: '/charges',
      views: {
        'charges-tab':{
          templateUrl: '/templates/charges.html',
          controller: 'ChargesController'
        }
      }
    });
  $urlRouterProvider.otherwise('/tab/home');
  });

mainIonic.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      // cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

mainIonic.controller('HomeController', function($scope, $http){
  $scope.platform = ionic.Platform.platform();

  $http.get('http://204.87.169.50:5000'+'/users').
    success(function(data,status,headers,config){
      $scope.users = data.users
    });

  $scope.create = function(player){
    $http.post('http://204.87.169.50:5000'+'/users', player)
      .success(function(data, status, headers, config) {
        $scope.users.push(data.user);
      })
  }

  $scope.addChuchada = function(player){
    $http.put('http://204.87.169.50:5000'+'/users/' + player.username + '/chuchada')
      .success(function(data, status, headers, config) {
        angular.forEach($scope.users,function(value, key){
          if(value.id == data.user.id)
            $scope.users[key] = data.user;
        });
      });
  }
});


mainIonic.controller('ChargesController', function($scope, $http){
  $scope.platform = ionic.Platform.platform();
});

mainIonic.controller('HistoriesController', function($scope, $http){
  $scope.platform = ionic.Platform.platform();
  $http.get('http://204.87.169.50:5000'+'/histories/').
  success(function(data,status,headers,config){
    $scope.histories = data.histories;
  });

  $scope.refresh = function(){
    $scope.histories = [];
    $http.get('http://204.87.169.50:5000'+'/histories/').
      success(function(data,status,headers,config){
        $scope.histories = data.histories;
      });
  }
});