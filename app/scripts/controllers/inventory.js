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
	.controller('InventoryCtrl', ['$scope', 'inventory', function ($scope, inventory) {

	$scope.items = inventory.get();

	$scope.items.$loaded(function() {
		// Success
	});

	$scope.index = inventory.getIndex();

	$scope.index.$loaded(function() {
		// Success Index
	});

	$scope.add = function(){
		inventory.create($scope.newItem).then(function(ref){
			$scope.newItem = {};
		});
	};

	$scope.save = function(index){
		inventory.save($scope.items, index);
	};

	$scope.remove = function(index){
		inventory.removeById($scope.items[index].id);
	};

	$scope.newItem = {};
	
  }
]);