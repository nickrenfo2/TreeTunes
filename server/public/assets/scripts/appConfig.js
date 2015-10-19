/**
 * Created by Nick on 10/15/15.
 */
var app = angular.module('myApp',[]);
//console.log('setting whitelist?');
app.config(function($sceDelegateProvider){
    //console.log('setting whitelist');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/**'
    ]);
    //$routeProvider
    //.when('/',{
    //        templateUrl:'views/test.html',
    //        controller:'HomeController'
    //    });
    //
    //$locationProvider.html5Mode(true);
});
//console.log($sceDelegateProvider.resourceUrlWhitelist());
//app.config(function($routeProvider,$locationProvider){
//    $routeProvider
//    .when('/',{
//            templateUrl:'views/test.html',
//            controller:'HomeController'
//        });
//
//    $locationProvider.html5Mode(true);
//});