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
	.controller('OrdersCtrl', ['$scope', 'orders', function ($scope, orders) {

	$scope.items = orders.get();

	$scope.items.$loaded(function() {
	   $scope.loading = false;
	});

	$scope.openStatus = function(status, index){
		$scope.session.status = status;
		$scope.session.index = index;
	}

	$scope.setStatus = function(status, index){
		$scope.session.status = status;
		$scope.items[$scope.session.index].status = status;
		orders.save($scope.items, $scope.session.index);
	}

	$scope.remove = function(index){
		orders.removeById($scope.items[index].id);
	};

	$scope.loading = true;
	$scope.session = {};
	$scope.filter = {};
	
  }
]);


 // ----- Orders Create Controller -----
angular.module('orderSystemApp')
	.controller('OrdersCreateCtrl', function ($scope, orders, inventory) {

		$scope.index = orders.getIndex();
		$scope.index.$loaded(function() {
			// Success Index
		});

		$scope.items = inventory.get();
		$scope.items.$loaded(function() {
			$scope.cart = $scope.items;
			console.log('Session Items',$scope.inventory);
			// Success Index
		});

		$scope.create = function(){
			orders.create({user: $scope.user, order: $scope.order}).then(function(ref){
				$('#successModal').modal('show');
				$scope.user = {};
			});
		};

		$scope.updatePrice = function() {
			$scope.order = orders.getPrice($scope.cart);
			console.log('order obj:', $scope.order);
		}

		$scope.user = {};
		$scope.order = {
				items: [],
				date: '1/1/2016',
				subtotal: 0,
				tax: 0,
				total: 0
			}
		$scope.cart = {};

	});



angular.module('orderSystemApp')
	.controller('OrdersEditCtrl', function ($scope, $routeParams, orders) {

		$scope.item = orders.getById($routeParams.id);

		$scope.item.$loaded(function() {
		   $scope.loading = false;
		});

		$scope.save = function(){
			orders.saveById($scope.item);
		}

		$scope.loading = true;

	});



angular.module('orderSystemApp')
	.controller('OrdersViewCtrl', function ($scope, $routeParams, orders) {

		$scope.item = orders.getById($routeParams.id);

		$scope.item.$loaded(function() {
		   $scope.loading = false;
		});

		$scope.save = function(){
			orders.saveById($scope.item);
		}

		$scope.loading = true;

	});
