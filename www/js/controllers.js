angular.module('starter.controllers')

   .controller('FetchController', ['$scope', '$http', '$templateCache',
    function($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'http://www.monroy-ramirez.cl/HomeManager/prueba_ws.php';

    $scope.fetch = function() {
      $scope.code = null;
      $scope.response = null;

      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $scope.data = response.data;
          console.log('Retorno WS', response.data);
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          console.log('Retorno WS', response.data || "Request failed");
      });
    };

    $scope.updateModel = function(method, url) {
      $scope.method = method;
      $scope.url = url;
    };
  }]);
