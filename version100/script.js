	// create the module and name it dvApp
	var dvApp = angular.module('dvApp', [
		  'ngRoute',
		  'ngResource',
		  'ui.bootstrap',
		  'angularMoment',
		  'directives.myGame',
		  'directives.myTutorial'
		]);

	dvApp.factory('_', function() {
		return window._; // assumes underscore has already been loaded on the page
	});  



	dvApp.constant("config", {
        "d3Id": "chart",
        "debugMode": true
    })



	dvApp.run(function ($rootScope,$compile) {
    /*
        Receive emitted message and broadcast it.
        Event names must be distinct or browser will blow up!
    */
	    $rootScope.$on('handleModalEmit', function(event, args) {
	        $rootScope.$broadcast('handleBroadcast', args);
	        console.log('hit this too');
	    });
	    
	    //new stuff
	    $rootScope.test = '';
	    $rootScope.rootdt = {
	    	val: '',
	    	ot: [], //this is the thing that gets watched in in makertimerp.js
	    	tmpl: '',
	    	count: 1
	    };


	});

	ControllerOne = dvApp.controller('loginController',['$scope', '$modal', '$log','config', function ($scope,$modal,$log,config) {
		$scope.cfg = config;
		$scope.user = {
		  user: 'admin',
		  password: null,
		  isLoggedIn: false
		};

		$scope.logMeIn = function () {
		  $modal.open({
		      templateUrl: 'modal.html',
		      backdrop: true,
		      windowClass: 'modal',
		      controller: function ($scope, $modalInstance, $log, user) {
		          $scope.user = user; //updates the current user
		          $scope.submit = function () {
		              $log.log('before auth',user)
		              if ((user.user === 'admin') && (user.password === '123')){//authentication logic, to be handled in backend.
		                  $scope.user.isLoggedIn = true;  
		                  console.log('hit this 1',user.user, user.password, $scope.user.isLoggedIn);
		              }
		              $scope.$emit('handleModalEmit',{eventMessage: $scope.user}); //send user data to rootscope to get broadcasted
		              $modalInstance.close(); //close dialog box
		          }
		          $scope.cancel = function () {
		              $modalInstance.dismiss('cancel'); //cancel dialog box
		          };
		      },
		      resolve: {
		          user: function () {
		              return $scope.user;
		          }
		      }
		  });
		};

		$scope.logMeOut = function(){
			//console.log($scope.user); //can get updated because binded
			$scope.user.isLoggedIn = false;
			$scope.user.user = '';
			$scope.user.password = null;
		}
	}]);

	

	// create the controller and inject Angular's $scope
	ControllerZero = dvApp.controller('mainController', ['$scope','$location','config',function ($scope,$location,config) { 
		$scope.cfg = config;
		$scope.isActive = function (viewLocation) { 
	        return viewLocation === $location.path();
	    };
		//main controller gets information passed from login controller
		$scope.$on('handleBroadcast', function(event, args) {
		  $scope.eventMessage = args.eventMessage;
		}); 
        
		
	}]);

	dvApp.controller('MainCtrl', function($scope) {
		$scope.name = "Hello directive testing world";
	});

		

	var organizationController = function($scope, $http, $q, _) {
		$scope.message = 'Organization Chart';
	}
	organizationController.$inject = ['$scope','$http','$q', '_'];
	dvApp.controller('organizationController',organizationController);

	var impactController= function($scope, $http) {
		$scope.message = 'Impact by Location and/or Resource';
		
	};	
	impactController.$inject = ['$scope','$http'];
	dvApp.controller('impactController',impactController);

	var contactController = function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	};	
	contactController.$inject = ['$scope'];
	dvApp.controller('contactController',contactController);

	var playController = function($scope) {
		$scope.message = 'Vertical list of processes and product';
	};	
	playController.$inject = ['$scope'];
	dvApp.controller('playController',playController);

	var productController = function($scope) {
		$scope.message = 'picture of product verticals';

		//testing
		$scope.orderByField = 'firstName';
		$scope.reverseSort = false;

		$scope.data = {
		employees: [{
		  firstName: 'John',
		  lastName: 'Doe',
		  age: 30
		},{
		  firstName: 'Frank',
		  lastName: 'Burns',
		  age: 54
		},{
		  firstName: 'Sue',
		  lastName: 'Banter',
		  age: 21
		}]
		};
	};	
	productController.$inject = ['$scope'];
	dvApp.controller('productController',productController);

	var processController = function($scope,$q,$http) {
		$scope.message = 'proccesses and will update soon';		
			
	};	
	processController.$inject = ['$scope','$q','$http'];
	dvApp.controller('processController',processController);


	// configure our routes
	dvApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			.when('/play', {
				templateUrl : 'pages/play.html',
				controller  : 'playController'
			})

			.when('/product', {
				templateUrl : 'pages/product.html',
				controller  : 'productController'
			})

			.when('/process', {
				templateUrl : 'pages/process.html',
				controller  : 'processController'
			})

			
			

	});


	ControllerOne.$inject = ['$scope'];
	ControllerZero.$inject = ['$scope'];