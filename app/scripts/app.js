'use strict';

/**
 * @ngdoc overview
 * @name orderSystemApp
 * @description
 * # orderSystemApp
 *
 * Main module of the application.
 */
angular
  .module('orderSystemApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/orders/view', {
        templateUrl: 'views/orders.view.html',
        controller: 'ViewOrderCtrl'
      })
      .when('/orders/edit', {
        templateUrl: 'views/orders.edit.html',
        controller: 'OrdersEditCtrl'
      })
      .when('/orders/create', {
        templateUrl: 'views/orders.create.html',
        controller: 'OrdersCreateCtrl'
      })
      .when('/inventory', {
        templateUrl: 'views/inventory.html',
        controller: 'InventoryCtrl'
      })
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
