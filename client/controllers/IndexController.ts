/**
 * Created by Nick on 10/13/15.
 */
///<reference path='../tsDefs.d.ts'/>
app.controller("IndexController", ["$scope", "$http",'$sce', function ($scope: ICustomScope, $http: ng.IHttpService,$sce){
    $scope.itworks = "Hello World!";
    $scope.leftMenuBtns =[];
    //var widget = SC.Widget('sc-player-iframe');
    $scope.newSong = 'kid-cudi-dat-new-new-dirty';
    $scope.curSong = {
        id:"No Song Playing"
    };
    $scope.history = [];
    $scope.loggingIn = false;
    $scope.alert = {status:'',message:''};
    $scope.acct = {role:"listener",username:"",password:""};
    var pass = $scope.acct.password;
    $scope.acct.upper = /[A-Z]+/.test(pass);
    $scope.acct.lower = /[a-z]+/.test(pass);
    $scope.acct.num = /[0-9]+/.test(pass);
    $scope.acct.special = /[!@#$%^(){}[\]~\-_]+/.test(pass);

    var gPlayer;
    SC.initialize({
        client_id: '2f5df4628f89bc06dc6f88789d5eb0ae',
        redirect_uri: 'http://treesradio.net/soundcloud/callback.html'
    });
    //console.log('getting tracks');
    $scope.searchSong = function(songname) {
        console.log('Searching for song:',songname);
        SC.get('/tracks/'+songname).then(function (track) {
            //console.log(track);
            $scope.curSong = track;
            console.log($scope.curSong);
            $scope.history.push(track);
            $scope.$apply();
            SC.stream('/tracks/' + track.id).then(function (player) {
                gPlayer = player;
                gPlayer.play();
            });
        });
    };

    //MJ - 6521918
    //NewNew - 20788160


    $scope.login = function(){
        console.log('logging in');
        $http.post('/login',$scope.acct).then(function(resp){
            //console.log(resp);
            $scope.loggingIn = false;
            if (resp.data.success){
                setAlert('Thank you for logging in','success');
                getMenuBtns();
            }
        });

    };

    //Loads the menu buttons from the database. At present, there are only left menu buttons.
    function getMenuBtns(){
        $scope.leftMenuBtns = [];
        $http.get('/menuBtns').then(function(resp){
            //console.log(resp.data);
            for (var i=0;i< <any>resp.data.length;i++){
                $scope.leftMenuBtns.push(resp.data[i]);
                var thisBtn = $scope.leftMenuBtns[i];
                var action = thisBtn.action;
                thisBtn.action = new Function(action);
            }
        },function(resp){
            if (resp.status == 401) {
                $scope.leftMenuBtns = [{icon:"sign-in",title:"Log In",action:$scope.login}];
            }
        });

    }

    //if pass meets requirements, will submit the account to the server to register
    $scope.registerAcct = function() {
        if (checkPass()) {
            $scope.loggingIn = false;
            $http.post('/register', $scope.acct).then(function (resp) {
                console.log(resp.data);
                setAlert("Thank you for registering", 'success');
                setTimeout(function () {
                }, 3000);
                getMenuBtns();
            });
        }
        else
            setAlert('Password must contain: Uppercase letter,Lowercase letter,number,special character','danger');

    };

    //accepts a string for message, and a string for the bootstrap alert class
    //sets the alert message to appear with the message, and disappear after 3 seconds
    function setAlert(msg:String,status:String){
        $scope.alert.message = msg;
        $scope.alert.status = status;
        //console.log(status,msg);
        setTimeout(function(){
            //console.log('leave');
            $scope.alert.status = "";
            $scope.alert.message = "";
            $scope.$apply();
        },3000);
    }

    //checks the password requirements. sets $scope.acct booleans for each requirement
    //returns true if pass meets requirements, else false
    function checkPass(){
        //console.log('checkPass');
        var pass = $scope.acct.password;
        $scope.acct.upper = /[A-Z]+/.test(pass);
        $scope.acct.lower = /[a-z]+/.test(pass);
        $scope.acct.num = /[0-9]+/.test(pass);
        $scope.acct.special = /[!@#$%^(){}[\]~\-_:]+/.test(pass);
        $scope.acct.length = pass.length >= 8;
        return $scope.acct.upper && $scope.acct.lower && $scope.acct.num && $scope.acct.special && $scope.acct.length;
    }


    //every time the user types in the login/register password box, it will run checkpass to update the password requirement booleans
    $scope.$watch('acct.password',function(){
        checkPass();
    });
    getMenuBtns();
}]);


