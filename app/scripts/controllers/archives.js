'use strict';

/**
 * @ngdoc function
 * @name orderSystemApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the orderSystemApp
 */

 // ----- Orders List Controller -----
angular.module('orderSystemApp')
	.controller('ArchivesCtrl', ['$scope', 'archives', 'orders', function ($scope, archives, orders) {

	$scope.items = archives.get();
	$scope.orders = orders.get();

	$scope.items.$loaded(function() {
	   $scope.loading = false;
	});

	$scope.orders.$loaded(function() {
	   $scope.loading = false;
	});

	$scope.newArchive = function() {
		console.log("controllers-save");
		$scope.items = $scope.orders;
		archives.new($scope.items);
	}

	$scope.loading = true;
	$scope.filter = {};
	$scope.fullList = [];
	
  }
]);

 // ----- Orders View Controller -----
angular.module('orderSystemApp')
	.controller('ArchivesViewCtrl', ['$scope', '$routeParams', '$window', 'archives', function ($scope, $routeParams, $window, archives) {

		$scope.item = archives.getById($routeParams.id);

		$scope.item.$loaded(function() {
			console.log($scope.item);
		   $scope.loading = false;
		   $scope.item.order.items = _.filter($scope.item.order.items, function(obj){
		   	return obj.qty > 0;
		   });

		});

		$scope.print = function(){
			$window.print()
		}

		$scope.loading = true;
	
  }
]);


