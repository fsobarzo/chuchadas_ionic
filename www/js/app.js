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
          templateUrl: 'templates/home.html',
          controller: 'HomeController'
        }
      }
    })
    .state('tabs.history',{
      url: '/history',
      views: {
        'history-tab': {
          templateUrl: 'templates/history.html',
          controller: 'HistoriesController'
        }
      }
    })
    .state('tabs.charges',{
      url: '/charges',
      views: {
        'charges-tab':{
          templateUrl: 'templates/charges.html',
          controller: 'ChargesController'
        }
      }
    });
  $urlRouterProvider.otherwise('/tab/home');
  });

mainIonic.run(function($ionicPlatform, $http,$timeout,$state) {
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
});

mainIonic.directive('historyIcon',function(){
  return {
    restrict: 'E',
    scope: {
      'history': '='
    },
    templateUrl: 'templates/directives/history-icon.html',
    link: function(scope,elem,attrs){
      var _icons = [
        'ion-pound',
        'ion-edit',
        'ion-cash',
        'ion-loop',
        'ion-person-add',
        'ion-cash',
        'ion-social-usd',
        'ion-speakerphone'
      ];
      scope.icon = _icons[scope.history.tag];

      var btn = elem.children().find('button')[0];
      var _height =  btn.offsetHeight;
      btn.style.position = "absolute";
      btn.style.top = "50%";
      btn.style.marginTop = -_height/2 + "px";
    }
  };
  });

mainIonic.factory('chuchadasFactory',['$http','$q',
  function($http,$q){
    var _link = "http://204.87.169.50:5000"
    var _users = {};
    var _histories = {};
    var _charges = {};
    var _chuchadaNewPromise = $q.defer();
    var _chuchadaUpdatePromise = $q.defer();

    var update = function(){
      var uPrm = $q.defer();
      $http.get(_link+'/users')
        .success(function(data,status,headers,config){
          _users = data.users;
          uPrm.resolve();
        });

      var hPrm = $q.defer();
      $http.get(_link+'/histories/')
        .success(function(data,status,headers,config){
          _histories = data.histories;
          hPrm.resolve();
        });

      var cPrm = $q.defer();
      $http.get(_link+'/charges')
        .success(function(data,status,headers,config){
          _charges = data.charges;
          cPrm.resolve();
        });
      var updatePromise = $q.all([uPrm.promise,hPrm.promise,cPrm.promise]);
      return updatePromise;
    }
    var _newChuchada = function(player){
      var _user;
      $http.post(_link+'/users/'+player.username+'/chuchada')
        .success(function(data, status, headers, config) {
          angular.forEach(_users,function(value, key){
            if(value.id == data.user.id){
              _users[key] = data.user;
              _user = data.user;
            }
          });
        })
        .error(function(data, status, headers, config){
          console.log(data);
          console.log(status);
        });
      //PROMISE
      return _user;
    }
    
    update().then(function(){
      _chuchadaNewPromise.resolve();
    });
    

    var information = {
      name: 'ChuchadasApp',
      getNewPromise: function(){
        return _chuchadaNewPromise.promise;
      },
      getUpdatePromise: function(){
        update().then(function(){
          _chuchadaUpdatePromise.resolve();
        });
        return _chuchadaUpdatePromise.promise;
      },
      getUsers: function(){
        return _users;
      },
      getHistories: function(){
        return _histories;
      },
      getCharges: function(){
        return _charges;
      },
      newChuchada: function(player){
        return _newChuchada(player);
      },
      newUser: function(player){
        return _newUser(plater)
      }
    };

    return information;
  }]);

mainIonic.controller('HomeController',['$scope','$http','chuchadasFactory',
  function($scope, $http, chuchadasFactory){
    $scope.platform = ionic.Platform.platform();
    // OBTENER USUARIOS
    var myPromise = chuchadasFactory.getNewPromise();
    myPromise.then(
      function(){ //SUCCESS PROMISE
        $scope.users = chuchadasFactory.getUsers();
      },
      function(){ //ERROR PROMISE
        $scope.users = [];
      });
    // UPDATE USUARIOS
    $scope.update = function(){
      var updatePromise = chuchadasFactory.getUpdatePromise();
      updatePromise.then(
        function(){
          $scope.users = chuchadasFactory.getUsers();
        },
        function(){
          // ERROR MESSAGE
        });
    }
    $scope.addChuchada = function(player){
      chuchadasFactory.newChuchada(player);
    }
}]);

mainIonic.controller('HistoriesController', function($scope, $http,chuchadasFactory){
  $scope.platform = ionic.Platform.platform();
  var myPromise = chuchadasFactory.getNewPromise();
  myPromise.then(
    function(){ //SUCCESS PROMISE
      $scope.histories = chuchadasFactory.getHistories();
    },
    function(){ //ERROR PROMISE
      $scope.histories = [];
    });

  $scope.refresh = function(){
    $scope.histories = [];
    $http.get('http://204.87.169.50:5000'+'/histories/').
      success(function(data,status,headers,config){
        $scope.histories = data.histories;
      });
  }
});

mainIonic.controller('ChargesController', function($scope, $http){
  $scope.platform = ionic.Platform.platform();
});
