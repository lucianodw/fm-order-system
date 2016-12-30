'use strict';

/**
 * @ngdoc function
 * @name orderSystemApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the orderSystemApp
 */


angular.module('orderSystemApp')
	.controller('ReportsCtrl', function ($scope, $routeParams, orders, reports) {
		$scope.items = reports.get();

		$scope.items.$loaded(function() {
		   $scope.loading = false;
		   $scope.report = reports.getTotals();
		});

		$scope.previewItem = function(item){
			$('#previewReport').modal('show');
			$scope.preview = item;
			$scope.preview.qtyArray = _.countBy($scope.preview.qtyTotals, _.identity);
			_.sortBy($scope.preview.qtyArray, function(key){
				return key;
			});
		};

		$scope.search = function(){
			console.log('-- Search --');
			console.log('Start Date: ' + $scope.filter.startDate);
			console.log('End Date: ' + $scope.filter.endDate);
			$scope.report = reports.getTotals($scope.filter);
		};

		$scope.loading = true;
		$scope.filter = {
			startDate:  '',
			endDate:  ''
		};

	});