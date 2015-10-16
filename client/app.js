/// <reference path="./tsDefs.d.ts"/>
//console.log('Begin Greeter');
//
//function greeter(person: string){
//    return "Hello, "+person;
//}
//var user = "Jane User";
//console.log(greeter(user));
var app = angular.module('myApp', []);
app.controller("IndexController", ["$scope", "$http", function ($scope, $http) {
    $scope.itworks = "Hello World!";
}]);
//# sourceMappingURL=app.js.map