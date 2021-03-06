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
    'ngTouch',
    'firebase',
    'orderFilters'
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
      .when('/orders/view/:id', {
        templateUrl: 'views/orders.view.html',
        controller: 'OrdersViewCtrl'
      })
      .when('/orders/edit/:id', {
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
      .when('/archives', {
        templateUrl: 'views/archives.html',
        controller: 'ArchivesCtrl'
      })
      .when('/archives/view/:id', {
        templateUrl: 'views/archives.view.html',
        controller: 'ArchivesViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  $(function() {
    FastClick.attach(document.body);
});
