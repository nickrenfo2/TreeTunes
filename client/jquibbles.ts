/**
 * Created by Nick on 10/13/15.
 */
/// <reference path='./tsDefs.d.ts'/>
$(function() {
    resizeMain();
    $(window).resize(function(){
        resizeMain();
    })

    //resizes the Main element and the leftMenu to be 100% height
    function resizeMain(){
        $('.mainWrapper').height($(window).height())
        $('.leftMenu').height($('.mainWrapper').height());
        $('.rightSidebar').height($('.mainWrapper').height());
    }
});
//console.log('running SC');
//SC.initialize({
//    client_id: '2f5df4628f89bc06dc6f88789d5eb0ae',
//    redirect_uri: 'http://treesradio.net/soundcloud/callback.html'
//});
//console.log('getting tracks');
//SC.get('/tracks/kid-cudi-marijuana').then(function(track){
//    console.log(track);
//    SC.stream('/tracks/'+track.id).then(function (player){
//        player.play();
//    });
//});