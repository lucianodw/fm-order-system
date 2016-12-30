'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('archives', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var archives = {};

	// PRODUCTION
	var baseUrl = "https://vivid-heat-2406.firebaseio.com"

	// STAGING
	// var baseUrl = "https://fmordersystemdev.firebaseio.com"

	var ref = new Firebase(baseUrl+"/archives");
	var refArray = $firebaseArray(ref);

	var refBase = new Firebase(baseUrl);
	var refBaseArray = $firebaseArray(refBase);

	var refOrder = new Firebase(baseUrl+"/orders");
	var refOrderArray = $firebaseArray(refOrder);

	var newOrders, singleArray;


	archives.get = function(){
		return refArray;
	};

	archives.getSnapshot = function(){
		var data;

		ref.once("value", function(snapshot) {
			data = snapshot.exportVal();
		});

		return data;
	}

	archives.getById = function(id){
		singleArray = $firebaseObject(ref.child(id));
		return singleArray;
	};

	archives.new = function(items){
		console.log('services - new');
		var len = items.length;
		console.log("Archive Items: ",len);
		for(var i = 0; i < len; i++) {
			refArray.$add(items[i]).then(function(ref) {
				if(i = (len-1)) {
					archives.resetOrders();
				}
			}, function(error) {
				console.log(error);
			});
		}



	};

	archives.resetOrders = function(id){
 		var index = refBaseArray.$indexFor("orders");
		console.log('services - reset', index);
		refBaseArray.$remove(index).then(function(ref) {console.log(ref.key())}, function(error) {console.log(error)});
	};

    return archives;
}]);
