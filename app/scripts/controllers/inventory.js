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

	$scope.save = function(){
		inventory.save($scope.items, $scope.editIndex);
		$('#editModal').modal('hide');
	};

	$scope.moveUp = function(index) {
		var newIndex = index-2;

		if(newIndex < 0) {
			console.log('Invalid Index!');
			return;
		}

		var spliceArr = $scope.items.splice(index-1,1);
		$scope.items.splice(newIndex, 0, spliceArr[0]);

		_.each($scope.items, function(obj, index) {
			obj.id = index+1;
			obj.$id = index+1;
		});	

		inventory.saveAll($scope.items);
	}

	$scope.moveDown = function(index) {
		var newIndex = index;

		if( newIndex > ($scope.items.length+1) ) {
			console.log('Invalid Index!');
			return;
		}

		var spliceArr = $scope.items.splice(index-1,1);
		$scope.items.splice(newIndex, 0, spliceArr[0]);

		_.each($scope.items, function(obj, index) {
			obj.id = index+1;
			obj.$id = index+1;
		});	

		inventory.saveAll($scope.items);
	}

	$scope.edit = function(index, item){
		console.log(index, item);
		$scope.editIndex = 0;
		$scope.editItem = item;
		$scope.editIndex = index;
		$('#editModal').modal('show');
	};

	$scope.remove = function(index){
		inventory.removeById($scope.items[index].id);
	};

	$scope.newItem = {};
	
  }
]);