'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('orders', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var orders = {};
	var ref = new Firebase("https://vivid-heat-2406.firebaseio.com/orders");
	var refArray = $firebaseArray(ref);


	var refIndex = new Firebase("https://vivid-heat-2406.firebaseio.com/orderIndex");
	var refIndexObj = $firebaseObject(refIndex);
	var singleArray;

	orders.get = function(){
		return refArray;
	};

	orders.getById = function(id){
		singleArray = $firebaseObject(ref.child(id));
		return singleArray;
	};

	orders.getIndex = function(){
		return refIndexObj;
	};

	orders.save = function(items, index){
		refArray[index] = items[index];
		refArray.$save(index).then(function(ref) {console.log('s')}, function(error) {console.log(error)});
	};

	orders.saveById = function(item){
		singleArray = item;
		singleArray.$save().then(function(ref) {console.log(ref.key())}, function(error) {console.log(error)});
	};

	orders.removeById = function(id){
		$firebaseObject(ref.child(id)).$remove();
	};

	orders.create = function(orderObj){
		var deferred = $q.defer();

		var obj = {
			id: refIndexObj.id,
			status: 'Not Started',
			date: orders.currentDate(),
			user: orderObj.user,
			order: orderObj.order
		};

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

	orders.getPrice = function(cartObj){
		 var subtotal = 0;
		 var tax = 10;
		 var total = 0;
		 var items = [];

	        angular.forEach(cartObj, function(obj) {
	            subtotal += parseInt(obj.qty) *parseInt(obj.price);
	        });

	       _.each(cartObj, function(obj){
	        	if(parseInt(obj.qty) > 0) {
	        		var newObj = {
		        		name: obj.name,
					id: obj.id,
					category: obj.category,
					unit: obj.unit,
					price: obj.price,
					qty: obj.qty
	        		}

	        		items.push(newObj);
	        	}
	        });

	        total = tax + subtotal;

	        var obj = {
	        	items: items,
	        	subtotal: subtotal,
	        	tax: tax,
	        	total: total
	        }

	        return obj;
	}

	orders.currentDate = function(){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		var newDate = month + '/' +  day + '/' + year;

		return newDate;
	};

    return orders;
}]);
