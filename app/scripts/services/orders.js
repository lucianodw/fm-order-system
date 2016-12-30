'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('orders', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var orders = {};

	// PRODUCTION
	// var baseUrl = "https://vivid-heat-2406.firebaseio.com"

	// STAGING
	var baseUrl = "https://fmordersystemdev.firebaseio.com"

	var ref = new Firebase(baseUrl+"/orders");
	var refArray = $firebaseArray(ref);

	var refIndex = new Firebase(baseUrl+"/orderIndex");
	var refIndexObj = $firebaseObject(refIndex);

	var singleArray;

	var TAX_RATE = 0.07;

	orders.get = function(){
		return refArray;
	};

	orders.getSnapshot = function(){
		var data;

		ref.once("value", function(snapshot) {
			data = snapshot.exportVal();
		});

		return data;
	}

	orders.getById = function(id){
		singleArray = $firebaseObject(ref.child(id));
		return singleArray || [];
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
		console.log('create service');
		var deferred = $q.defer();

		var items = [];

		_.each(orderObj.order.items, function(obj){
			delete obj['$id'];
			delete obj['$priority'];
			delete obj['$$hashKey'];
			console.log(obj);
			items.push(obj);
		});

		orderObj.order.items = items;
		
		var obj = {
			id: orderObj.order.id,
			status: 'In Progress',
			date: orders.currentDate(),
			user: orderObj.user,
			order: orderObj.order
		};

		ref.child(obj.id).set(obj, function(error){
			deferred.resolve(error);

			if(!error) {
				refIndexObj.id++;
				refIndexObj.$save();
			}
		});

		return deferred.promise;
	};

	orders.updateItem = function(item) {
		item.price = item.qty * item.unitPrice;
		return item;
	}

	orders.updateTotals = function(fullOrder){
		console.log(fullOrder);
		var subtotal = 0;

		_.each(fullOrder.order.items, function(item){
			if(typeof item.price == 'number') {
				subtotal += item.price;
			}
		});
		
		fullOrder.order.tax = subtotal * TAX_RATE;
		fullOrder.order.subtotal = subtotal;
		fullOrder.order.total = fullOrder.order.tax + fullOrder.order.subtotal;

		return fullOrder;
	}

	orders.updateTotalsOnly = function(orderObj) {
		if(orderObj.userSubtotal > 0) {
			orderObj.tax = orderObj.userSubtotal * TAX_RATE;
			orderObj.total = parseFloat(orderObj.userSubtotal) + parseFloat(orderObj.tax);
			
		} else {
			orderObj.total = 0;
			orderObj.tax = 0;
		}
		
		return orderObj;
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
