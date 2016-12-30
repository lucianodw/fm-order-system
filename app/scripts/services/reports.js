'use strict';
/* Controllers */

angular.module('orderSystemApp').factory('reports', ['$firebaseArray', '$firebaseObject', '$q', function($firebaseArray, $firebaseObject, $q) {
	
	// create a reference to the Firebase database where we will store our data
	var reports = {};

	// PRODUCTION
	var baseUrl = "https://vivid-heat-2406.firebaseio.com"

	// STAGING
	// var baseUrl = "https://fmordersystemdev.firebaseio.com"

	var ref = new Firebase(baseUrl+"/orders");

	var refArray = $firebaseArray(ref);


	reports.get = function(){
		return refArray;
	};

	reports.getByFilter = function(startTime, endTime){
		var newRef = new Firebase(baseUrl+"/orders")
					.startAt(startTime)
					.endAt(endTime)
					.once('value', function(snap) {
					console.log('messages in range', snap.val());
					});

		var newRefArray = $firebaseArray(ref);
		return newRefArray;
	};

	reports.getTotals = function(filter){
		var raw;
		var data = [];
		var finalData = {};

		// Get Clone of Firebase
		ref.once("value", function(snapshot) {
			raw = snapshot.exportVal();
		});

		console.log(raw.length);

		if(filter) {

			raw = _.filter(raw, function(obj){
				var date1 = filter.startDate.substr(3, 2)+"/"+filter.startDate.substr(0, 2)+"/"+filter.startDate.substr(6, 4);
				var date2 = filter.endDate.substr(3, 2)+"/"+filter.endDate.substr(0, 2)+"/"+filter.endDate.substr(6, 4);
				var check = obj.date.substr(3, 2)+"/"+obj.date.substr(0, 2)+"/"+obj.date.substr(6, 4);

				var  d1 = date1.split("/");
				var  d2 = date2.split("/");
				var  c = check.split("/");

				var fromDate = new Date(d1[2], d1[1]-1, d1[0]);  // -1 because months are from 0 to 11
				var toDate   = new Date(d2[2], d2[1]-1, d2[0]);
				var checkDate = new Date(c[2], c[1]-1, c[0]);

				return checkDate > fromDate && checkDate < toDate;

			});

			console.log('raw', raw);
		}

		// Get all items from all orders
		_.each(raw, function(obj){
			var arr = reports.convertToArray(obj.order.items);
			data = data.concat(arr);
		});

		// Remove Items with 0 Quantities.
		data = _.filter(data, function(item){
			return item.qty;
		});

		// Create Array with totals for each product
		_.each(data, function(item){
			if (!finalData['item_'+item.id]) {
				finalData['item_'+item.id] = {
					name: item.name,
					id: item.id,
					total: 0,
					qtyTotals: []
				};
			}

			finalData['item_'+item.id].qtyTotals.push(item.qty);

			finalData['item_'+item.id].total = finalData['item_'+item.id].total + parseInt(item.qty);
		});

		_.each(finalData, function(obj){
			obj.qtyArray = _.countBy(obj.qtyTotals, _.identity);
			obj.qtyArray = _.sortBy(obj.qtyArray, function(frequency){
				return frequency;
			});
		});

		// Sort by most orders
		finalData = _.sortBy(finalData, function(obj){
			return -obj.total;
		});

		
		return finalData;
	};

	reports.convertToArray = function(obj) {
		var arr = [];

		_.each(obj, function(item){
			arr.push(item);
		});

		return arr;
	}


    return reports;
}]);
