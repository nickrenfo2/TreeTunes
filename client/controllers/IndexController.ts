/**
 * Created by Nick on 10/13/15.
 */
///<reference path='../tsDefs.d.ts'/>
app.controller("IndexController", ["$scope", "$http",'$cookies', function ($scope, $http: ng.IHttpService,$cookies){
    $scope.itworks = "Hello!";
    $scope.menuBtns =[];
    //var widget = SC.Widget('sc-player-iframe');
    $scope.newSong = 'kid-cudi';
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
    $scope.searchOpen = false;
    $scope.mgmtOpen = false;
    $scope.showDev = false;
    $scope.songProgressStyle = {};
    $scope.songProgress=0;
    var songProgressInterval;
    $scope.Math = Math;
    $scope.SCTrackResults = [];
    $scope.SCPlaylistResults = [];
    //$scope.messageHistory = [];
    $scope.loggedIn = !!$cookies.get('user');
    if ($scope.loggedIn){
        $scope.chatplaceholder = '';
    } else {
        $scope.chatplaceholder = 'Please log in to chat';
    }
    $scope.songQueue = [];
    $scope.volume = 100;
    $scope.muted = false;
    $scope.points = 0;
    $scope.loading = false;
    $scope.voted = false;
    $scope.upvote = false;
    $scope.downvote = false;
    var socket;
    var ioConnString = 'http://localhost:5000';
    var lastMsgUser = '';
    var defTrack = {id:146823529,title:"No song queued",duration:1};


    var gPlayer;
    SC.initialize({
        client_id: '2f5df4628f89bc06dc6f88789d5eb0ae',
        redirect_uri: 'http://treesradio.net/soundcloud/callback.html'
    });
    //console.log('getting tracks');
    $scope.searchSound = function(query) {
        console.log('Searching for song:',query);
        SC.get('/tracks/',{
            q:query,
            streamable:true
        }).then(function (tracks) {
            console.log(tracks);
            $scope.SCPlaylistResults = [];
            $scope.SCTrackResults = tracks;
            //$scope.$apply();
        });

    };

    $scope.searchPlaylists = function(qry){
        $scope.loading = true;
        SC.get('/playlists/',{
            streamable:true,
            q:qry
        }).then(function(lists){
            $scope.loading = false;
            $scope.SCTrackResults = [];
            $scope.SCPlaylistResults = lists;
            console.log(lists);
        },function(resp){
            console.log(resp);
            $scope.loading = false;
            setAlert('Playlists not available. Please try again in a few minutes','danger');
        })
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
            //console.log(resp.data);
            if (resp.data.success){
                $scope.loggingIn = false;
                setAlert('Thank you for logging in','success');
                getMenuBtns();
                //connectToChat();
                $scope.loggedIn = true;
                $scope.chatplaceholder = '';
            }
        });

    };

    $scope.logout = function(){
        $http.get('/logout').then(function(){
            $cookies.remove('user');
            getMenuBtns();
        });
        //console.log('log out');
    };

    //Loads the menu buttons from the database. At present, there are only left menu buttons.
    function getMenuBtns(){
        $scope.menuBtns = [];
        $http.get('/menuBtns').then(function(resp){
            //console.log(resp.data);
            for (var i=0;i< <any>resp.data.length;i++){
                $scope.menuBtns.push(new MenuBtn(resp.data[i]));
            }
        },function(resp){
            if (resp.status == 401) {
                $scope.loggedIn = false;
                $scope.menuBtns = [{icon:"sign-in",title:"Log In",action:function(){$scope.loggingIn = true},area:'left'}];
            }
        });
        //console.log('menu btns:');
        //console.log($scope.menuBtns);
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

    //given a Track object and optionally a time (in MS) to seek to,
    $scope.playSound =  function(track,time){
        if (!time)time = 0;
        //SC.get('/tracks/'+id).then(function (track) {
        //console.log(track);
        //console.log('playsound:',track.id);
        //console.log('current time:',time);
        $scope.songProgressStyle = {transition:"all linear 1s",width:"10px"};
        SC.stream('/tracks/' + track.id).then(function (player) {
            $scope.curSong = track;
            //console.log($scope.curSong);
            $scope.history.push(track);
            clearInterval(songProgressInterval);
            gPlayer = player;
            gPlayer.seek(time);
            gPlayer.play();
            setTimeout(function(){
                $scope.songProgressStyle = {transition:"all linear "+track.duration+"ms",width:"100%"};
                $scope.$apply();
            },3000);
            songProgressInterval = setInterval(function(){
                //$scope.songProgress++;
                $scope.$apply();
            },1000)
        });
        //});
    };

    $scope.formatTime = function(time){
        return Math.floor(Math.floor(time/1000)/60)+":"+("0"+time%60).substring(0,2);
    };

    $scope.queueAdd = function(track){
        console.log('adding track:',track);
        $http.post('/queue/add',track).then(function (resp) {
            $scope.getQueue();
        });
    };

    $scope.addList = function(list){
        console.log(list);
        for (var i=0;i<list.tracks.length;i++){
            $scope.queueAdd(list.tracks[i]);
        }
    };

    $scope.getQueue = function(){
        $http.get('/queue').then(function(resp){
            console.log('upcoming queue:');
            console.log(resp.data);
            $scope.songQueue = resp.data;
        });
    };

    $scope.kickoff = function(){
        $http.get('/queue/kickoff');
    };

    function advanceSong(){
        $scope.voted = false;
        $scope.upvote = false;
        $scope.downvote = false;
        $scope.points = 0;
        $http.get('/queue/next').then(function (resp){
            SC.get('/tracks/'+resp.data.id).then(function(track){
                if (resp.data == 'No song queued') track = defTrack;
                $scope.playSound(track,resp.data.curTime);
            });
        });
        $scope.getQueue();
    }

    $scope.advanceSong = function(){
        advanceSong();
    };

    function checkSong(){
        $http.get('/queue/next').then(function(resp){
            if (resp.data.id != $scope.curSong.id && $scope.curSong.id != defTrack.id){
                advanceSong();
            }
        });
    }

    $scope.vote = function(pts){
        $scope.voted=false;
        if (pts) {
            $scope.upvote = true;
            $scope.downvote = false;
        } else {
            $scope.downvote = true;
            $scope.upvote = false;
        }

        $http.post('/queue/vote',{pts:pts}).then(function (resp) {
            console.log(resp.data);
            if (resp.data.success) $scope.voted = true;
            else {
                $scope.upvote = false;
                $scope.downvote = false;
            }
        });
    };

    $scope.getVotes = function(){
        $http.get('/queue/votes').then(function(resp){
            console.log(resp.data);
            if (resp.data.success){
                $scope.points = resp.data.points;
            }
        });
    };

    function getVotes() {
        return $scope.getVotes();
    };

    $scope.skip = function(){
        $http.get('/queue/skip');
    };

    $scope.start = function(){};
    //$scope.searchSong($scope.newSong);

    //console.log('user cookie');
    //$cookies.put('test','testcookie');
    //console.log($cookies.getAll());
    //every time the user types in the login/register password box, it will run checkpass to update the password requirement booleans
    $scope.$watch('acct.password',function(){
        checkPass();
    });

    $scope.changeRank = function(usr){
        if (!usr.changeRank){
            usr.changeRank = true;
        } else {
            usr.changeRank = false;
        }
    };

    $scope.setVol = function(){
        var vol =0;
        if(!$scope.muted)
            vol=$scope.volume;
        gPlayer.setVolume(vol);
    };

    getMenuBtns();
    setInterval(checkSong,1000);
    advanceSong();




    function MenuBtn(btn){
        //console.log('new btn:');
        this.icon = btn.icon;
        this.title = btn.title;
        var action = btn.action;
        //console.log(action);
        this.action = function(){eval(action)};
        //console.log(this);
        this.area = btn.area;
    }
}]);
