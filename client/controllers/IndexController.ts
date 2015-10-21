/**
 * Created by Nick on 10/13/15.
 */
///<reference path='../tsDefs.d.ts'/>
app.controller("IndexController", ["$scope", "$http",'$cookies', function ($scope: ICustomScope, $http: ng.IHttpService,$cookies){
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
    $scope.historyOpen = false;
    $scope.songProgressStyle = {};
    $scope.songProgress=0;
    var songProgressInterval;
    $scope.Math = Math;
    $scope.SCResults = [];
    $scope.messageHistory = [];
    var socket;
    var ioConnString = 'http://localhost:5000';
    var lastMsgUser = '';


    var gPlayer;
    SC.initialize({
        client_id: '2f5df4628f89bc06dc6f88789d5eb0ae',
        redirect_uri: 'http://treesradio.net/soundcloud/callback.html'
    });
    //console.log('getting tracks');
    $scope.searchSound = function(query) {
        console.log('Searching for song:',query);
        SC.get('/tracks/',{
            q:query
        }).then(function (tracks) {
            console.log(tracks);
            $scope.SCResults = tracks;
            $scope.$apply();
        });

    };

    //MJ - 6521918
    //NewNew - 20788160



    $scope.toggleHistory = function(){
        //console.log('toggling history');
        $scope.historyOpen = !$scope.historyOpen;
    };

    $scope.login = function(){
        console.log('logging in');
        $http.post('/login',$scope.acct).then(function(resp){
            console.log(resp.data);
            $scope.loggingIn = false;
            if (resp.data.success){
                setAlert('Thank you for logging in','success');
                getMenuBtns();
                socket = io().connect(ioConnString,{
                    query:'session_id='+$cookies.get('user')
                });
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
                $scope.leftMenuBtns = [{icon:"sign-in",title:"Log In",action:function(){$scope.loggingIn = true}}];
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


    $scope.playSound =  function(track){
        //SC.get('/tracks/'+id).then(function (track) {
        //console.log(track);
        console.log('playsound:',track.id);
        SC.stream('/tracks/' + track.id).then(function (player) {
            $scope.songProgressStyle = {transition:"all linear 1s",width:"10px"};
            $scope.curSong = track;
            console.log($scope.curSong);
            $scope.history.push(track);
            clearInterval(songProgressInterval);
            gPlayer = player;
            gPlayer.play();
            setTimeout(function(){
                $scope.songProgressStyle = {transition:"all linear "+track.duration+"ms",width:"100%"};
            },1000);
            songProgressInterval = setInterval(function(){
                $scope.songProgress++;
                $scope.$apply();
            },1000)
        });
        //});
    };

    $scope.formatTime = function(time){
        return Math.floor(Math.floor(time/1000)/60)+":"+("0"+time%60).substring(0,2);
    };

    //$scope.searchSong($scope.newSong);

    //console.log('user cookie');
    //$cookies.put('test','testcookie');
    //console.log($cookies.getAll());
    //every time the user types in the login/register password box, it will run checkpass to update the password requirement booleans
    $scope.$watch('acct.password',function(){
        checkPass();
    });
    getMenuBtns();

    //SOCKETS STUFF BELOW

    if($cookies.get('user')){
        socket = io().connect(ioConnString,{
            query:'session_id='+$cookies.get('user')
        });

        socket.on('chat',function(msg){

            var hist = $scope.messageHistory;
            if (lastMsgUser == msg.user){
                var histLen = hist.length;
                hist[histLen-1].messages.push(msg.msg);
            } else {
                lastMsgUser = msg.user;
                hist.push({user:msg.user,messages:[msg.msg]});
            }

            console.log(hist);

            //$scope.messageHistory.push(msg);
            //$scope.apply();
        });
    }
    $scope.sendChat = function(){
        socket.emit('chat',$scope.chatMsg);
        $scope.chatMsg = '';
        return false;
    };




}]);
