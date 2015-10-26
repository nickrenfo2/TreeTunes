/**
 * Created by Nick on 10/21/15.
 */
app.controller('ManagementController',['$scope','$http',ManagementController]);
function ManagementController($scope,$http) {
    //console.log('playercontroller');
    var mg = this;
    mg.users = [];
    mg.roles = ['admin','host','dj','listener'];
    mg.http = $http;

    this.getUsers = function(){
        this.http.get('/users/all').then(function (resp) {
            mg.users = resp.data;
            //for (var i=0;i<mg.users.length;i++){
            //    var role = mg.users[i].role;
            //    if (mg.roles.indexOf(role)<0){
            //        mg.roles.push(role);
            //    }
            //}
        });
    };


    this.changeRole = function(usr){
        console.log(usr);
        $http.post('/users/role',usr).then(function(){
            mg.getUsers();
        });
    };



    this.getUsers();
}