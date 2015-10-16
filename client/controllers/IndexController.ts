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

    var gPlayer;
    //var scTrackUrl = 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/';
    //var scTrackOptions = '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=false';

    //console.log(app.$sceDelegateProvider.resourceUrlWhitelist());
    //console.log('running SC');
    SC.initialize({
        client_id: '2f5df4628f89bc06dc6f88789d5eb0ae',
        redirect_uri: 'http://treesradio.net/soundcloud/callback.html'
    });
    //console.log('getting tracks');
    $scope.searchSong = function(songname) {
        console.log('Searching for song:',songname);
        //if (gPlayer)
        //gPlayer.pause();
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

    //Loads the menu buttons from the database. At present, there are only left menu buttons.
    function getMenuBtns(){
        $scope.leftMenuBtns = [];
        //console.log('type of leftMenu', typeof $scope.leftMenuBtns);
        $http.get('/menuBtns').then(function(resp){
            console.log(resp.data);
            //$scope.leftMenuBtns = resp.data;
            //console.log($scope.leftMenuBtns);
            for (var i=0;i< <any>resp.data.length;i++){
                $scope.leftMenuBtns.push(resp.data[i]);
                var thisBtn = $scope.leftMenuBtns[i];
                //console.log(thisBtn);
                var action = thisBtn.action;
                thisBtn.action = new Function(action);
            }
        });
    }


    //widget.bind(SC.Widget.Events.PAUSE, function (){
    //    console.log('widget paused');
    //    widget.play();
    //});
    //
    //widget.bind(SC.Widget.Events.READY, function () {
    //    console.log('widget ready');
    //});

    //console.log(widget);

    function getSoundcloudTrackUrl(id:String){
        return 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/'+id+'&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=false';
    }

    getMenuBtns();
}]);
