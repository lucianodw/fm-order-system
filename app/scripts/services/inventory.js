'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('inventory', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var items = {};

	var ref = new Firebase("https://vivid-heat-2406.firebaseio.com/inventory");
	var refArray = $firebaseArray(ref);

	var refIndex = new Firebase("https://vivid-heat-2406.firebaseio.com/inventoryIndex");
	var refIndexObj = $firebaseObject(refIndex);

	items.get = function(){
		return refArray;
	};

	items.getIndex = function(){
		return refIndexObj;
	};

	items.getById = function(id){
		singleArray = $firebaseObject(ref.child(id));
		return singleArray;
	};

	items.save = function(items, index){
		refArray[index] = items[index];
		refArray.$save(index);
	};

	items.removeById = function(id){
		$firebaseObject(ref.child(id)).$remove();
	};

	items.create = function(itemObj){
		var deferred = $q.defer();

		var obj = {
				name: itemObj.name,
				id: refIndexObj.id,
				category: itemObj.category,
				unit: itemObj.unit,
				price: itemObj.price,
				qty: 0
			}

		ref.child(obj.id).set(obj, function(error){
			deferred.resolve(error);

			if(!error) {
				refIndexObj.id++;
				console.log('New ID: ', refIndexObj.id);
				refIndexObj.$save();
			}
		});

		return deferred.promise;
	};

    return items;
}]);
