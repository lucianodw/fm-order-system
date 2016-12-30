'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('inventory', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var items = {};

	// PRODUCTION
	// var baseUrl = "https://vivid-heat-2406.firebaseio.com"

	// STAGING
	var baseUrl = "https://fmordersystemdev.firebaseio.com"

	var ref = new Firebase(baseUrl+"/inventory");
	
	
	var refArray = $firebaseArray(ref);

	var refIndex = new Firebase(baseUrl+"/inventoryIndex");
	var refIndexObj = $firebaseObject(refIndex);

	items.get = function(){
		return refArray;
	};

	items.getByHoliday = function(holiday) {
		var refHoliday = $firebaseArray(ref.orderByChild('holiday').equalTo(holiday));
		return refHoliday;
	};

	items.getIndex = function(){
		return refIndexObj;
	};

	items.getById = function(id){
		singleArray = $firebaseObject(ref.child(id));
		return singleArray;
	};

	items.getEmptyItem = function(id){
		var obj = {
			name: '',
			id: 'custom',
			unit: '',
			category: '',
			holiday: '',
			description: '',
			qty: 0
		};

		return obj;
	};

	items.save = function(items, index){
		refArray[index] = items[index];
		refArray.$save(index);
	};


	items.saveAll = function(items){
		_.each(items, function(obj, index){
			refArray[index] = items[index];
			refArray.$save(index);
		});
		
	};

	items.removeById = function(id){
		$firebaseObject(ref.child(id)).$remove();
	};

	items.create = function(itemObj){
		var deferred = $q.defer();

		var obj = {
				name: itemObj.name,
				id: refIndexObj.id,
				unit: itemObj.unit,
				category: itemObj.category,
				holiday: itemObj.holiday,
				qty: 0
			}

		ref.child(obj.id).set(obj, function(error){
			deferred.resolve(error);

			if(!error) {
				refIndexObj.id++;
				refIndexObj.$save();
			}
		});

		return deferred.promise;
	};

    return items;
}]);
