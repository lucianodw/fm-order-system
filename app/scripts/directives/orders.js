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
	.directive("ngItem", ['orders', function(orders) {
	return {
		template: '<ng-include src="getTemplateUrl()"/>',
		scope: {
				item: '='
		},
		restrict: 'E',
		controller: function($scope, wines) {
			$scope.getTemplateUrl = function() {
					return "/views/templates/create.item.tpl.html";
			}
		}
	};
}]);


 // ----- Orders List Controller -----
angular.module('orderSystemApp')
	.directive("ngStatusModal", ['orders', function(orders) {
	return {
		template: '<ng-include src="getTemplateUrl()"/>',
		scope: {
				item: '='
		},
		restrict: 'E',
		controller: function($scope, wines) {
			$scope.getTemplateUrl = function() {
					return "/views/templates/modal.status.tpl.html";
			}
		}
	};
}]);
