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
	.controller('OrdersCtrl', ['$scope', 'orders', function ($scope, orders) {

	$scope.items = orders.get();

	$scope.items.$loaded(function() {
	   $scope.loading = false;
	});

	$scope.openStatus = function(status, index){
		$scope.session.status = status;
		$scope.session.index = index;
	}

	$scope.setStatus = function(status, index){
		$scope.session.status = status;
		$scope.items[$scope.session.index].status = status;
		orders.save($scope.items, $scope.session.index);
	}


	$scope.loading = true;
	$scope.session = {};
	$scope.filter = {};
	
  }
]);


 // ----- Orders Create Controller -----
angular.module('orderSystemApp')
	.controller('OrdersCreateCtrl', function ($scope, $timeout, $location, orders, inventory) {


		$scope.getOrderIndex = function() {
			$scope.index= orders.getIndex();
			$scope.index.$loaded(function() {
				$scope.data.order.id = $scope.index.id;
			});
		};


		$scope.getInventory = function(tag) {

			console.log('get inventory: ', tag);
			$scope.items = inventory.getByHoliday(tag);
			$scope.items.$loaded(function() {
				console.log('Items Loaded');
				$scope.data.order.items = $scope.items;

				// $timeout(function(){
				// 	splitList();
				// });

			});			
		}


		var splitList = function() {
			 $scope.limit = {};
			 console.log($scope.items.length);
			 $scope.limit.len = $scope.items.length;
			 $scope.limit.half1 = Math.floor($scope.items.length/2);
			 $scope.limit.half2 = Math.ceil($scope.items.length/2);
			 $scope.limit.half2 = ($scope.limit.half1 == $scope.limit.half2) ? ($scope.limit.half2+1) : $scope.limit.half2;
		}

		$scope.goToOrders = function() {
			$('#errorModal, #successModal').modal('hide');
			$('.modal-backdrop').remove();
			$location.path('/orders');
		}

		$scope.create = function(){
			console.log('test click');
			if ($scope.create_form.$valid) {
				orders.create($scope.data).then(function(ref){
					$('#successModal').modal('show');
					$scope.create_form.$setPristine();
					$scope.create_form.$setValidity();
					$scope.init();
				});
			} else {
				$('#errorModal').modal('show');
				$scope.create_form.submitted = true;
			}



		};

		// $scope.newItem = function(){
		// 	var obj = inventory.getEmptyItem();
		// 	obj.filter = 'single';
		// 	$scope.items.push(obj);
		// }

		$scope.updatePrice = function() {
			$scope.data.order.userSubtotal = '';
			$scope.data = orders.updateTotals($scope.data);
			// $scope.cart = $scope.item.order.items;
		}

		$scope.updateTotal = function() {
			$scope.data.order = orders.updateTotalsOnly($scope.data.order);
		}

		$scope.updateItem = function(action, id) {
			var index = $scope.data.order.items.map(function(e) { return e.id; }).indexOf(id);
			console.log(index);
			if (action == 'add') {
				console.log('add');
				console.log($scope.data.order.items[index]);
				$scope.data.order.items[index].qty++;
			}  
			else if (action == 'remove' && $scope.data.order.items[index].qty > 0) {
				$scope.data.order.items[index].qty--;
			} 
			
			$scope.data.order.items[index] = orders.updateItem($scope.data.order.items[index]);

			$scope.updatePrice();
		}

		$scope.updateTag = function() {
			console.log('update');
			localStorage.userTag = $scope.data.user.tag;
			$scope.getInventory($scope.data.user.tag);
		}

		$scope.init = function() {
			$scope.data = {
				order: {
					items: [],
					date: '1/1/2016',
					subtotal: 0,
					tax: 0,
					taxPercentage: .07,
					total: 0,
				},
				user: {}
			};

			$scope.getOrderIndex();

			if(localStorage.userTag) {
				$scope.data.user.tag = localStorage.userTag;
				$scope.getInventory($scope.data.user.tag);
			}
		};

		// ----- Initialize -----
		$scope.init();
		$scope.filter = {
			full: 'Full',
			single: 'Single'
		};

	});


angular.module('orderFilters', []).filter('holidayFilter', [function () {
    return function (holidayTag, tag) {
        var newTag = _.filter(holidayTag, function(obj) {
        	return obj.holiday == tag || obj.holiday == 'All';
        });

        return newTag
    };
}]);

angular.module('orderSystemApp')
	.controller('OrdersEditCtrl', function ($scope, $routeParams, $timeout, $location, orders) {

		// ----- Load Data from Firebase Start -----
		$scope.data = orders.getById($routeParams.id);

		$scope.data.$loaded(function() {
		   $scope.loading = false;
		   // splitList();
		});

		var splitList = function() {
			$timeout(function(){
		   		$scope.user.tag = $scope.data.user.tag;
		   		console.log('$scope.user.tag', $scope.user.tag);
				 $scope.limit = {};
				 $scope.limit.len = $scope.cart.length;
				 $scope.limit.half1 = Math.floor($scope.cart.length/2);
				 $scope.limit.half2 = Math.ceil($scope.cart.length/2);
				 $scope.limit.half2 = ($scope.limit.half1 == $scope.limit.half2) ? ($scope.limit.half2+1) : $scope.limit.half2;
			});			
		}
		// ----- Load Data from Firebase End -----
		


		// ----- Post-Save Modal Start -----
		$scope.goToOrders = function() {
			$('#errorModal, #updateModal').modal('hide');
			$('.modal-backdrop').remove();
			$location.path('/orders');
		}
		// ----- Post-Save Modal End -----



		// ----- Save Order Start -----
		$scope.save = function(){
			var modalElement;
			console.log($scope.data)
			if ($scope.edit_form.$valid) {
				modalElement = '#updateModal';
				orders.saveById($scope.data);
			} else {
				modalElement = '#errorModal';
				$scope.edit_form.submitted = true;
			}

			$(modalElement).modal('show');
		}
		// ----- Edit Form Actions End -----


		// ----- Remove Order Start -----
		$scope.confirmRemove = function(){
			$('#removeConfirmModal').modal('show');
		};

		$scope.remove = function(){
			orders.removeById($scope.data.id);
			$('#removeConfirmModal').modal('hide');
			$('.modal-backdrop').remove();
			$location.path('/orders');
		};
		// ----- Remove Order End -----


		// ----- Update Order Start -----
		$scope.updatePrice = function() {
			$scope.data.order.userSubtotal = '';
			$scope.data = orders.updateTotals($scope.data);
			// $scope.cart = $scope.item.order.items;
		}

		// FIX THIS
		$scope.updateTotal = function() {
			$scope.data.order = orders.updateTotalsOnly($scope.data.order);
		}

		$scope.updateItem = function(action, id) {
			var index = $scope.data.order.items.map(function(e) { return e.id; }).indexOf(id);

			if (action == 'add') {
				$scope.data.order.items[index].qty++;
			}  
			else if (action == 'remove' && $scope.data.order.items[index].qty > 0) {
				$scope.data.order.items[index].qty--;
			} 

			$scope.data.order.items[index] = orders.updateItem($scope.data.order.items[index]);

			$scope.updatePrice();
		}
		// ----- Update Order Start -----

		var init = function() {
			$scope.loading = true;
			$scope.filter = {
				full: 'Full',
				single: 'Single'
			};

			$scope.user = {
				tag: localStorage.userTag || ''
			};
		}

		// Initialize
		init();
	});



angular.module('orderSystemApp')
	.controller('OrdersViewCtrl', function ($scope, $routeParams, $window, orders) {

		$scope.item = orders.getById($routeParams.id);

		$scope.item.$loaded(function() {
		   $scope.loading = false;
		   $scope.item.order.items = _.filter($scope.item.order.items, function(obj){
		   	return obj.qty > 0;
		   });

		});

		$scope.save = function(){
			orders.saveById($scope.item);
		}

		$scope.print = function(){
			$window.print()
		}

		$scope.loading = true;

	});


angular.module('orderSystemApp').filter('myLimitTo', function() {
  return function(input, limit, begin) {
    return input.slice(begin, begin + limit);
  };
});


angular.module('orderSystemApp').directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});