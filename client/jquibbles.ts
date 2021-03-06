/**
 * Created by Nick on 10/13/15.
 */
/// <reference path='./tsDefs.d.ts'/>
$(function() {
    resizeMain();
    $(window).resize(function(){
        resizeMain();
    });
    var $cont = $('#messageContainer');
    $cont[0].scrollTop = $cont[0].scrollHeight;

    $('.chatbox').children('form').keyup(function(e) {
        if (e.keyCode == 13) {
            //$cont.append('<p>' + $(this).val() + '</p>');
            $cont[0].scrollTop = $cont[0].scrollHeight;
            $(this).val('');
        }
    }).focus();

    //resizes the elements that need 100% height
    function resizeMain(){
        $('.mainWrapper').height($(window).height())
        $('main').height($('.mainWrapper').height());
        $('.contentWrapper').height($('main').height());
        $('.leftMenu').height($('.mainWrapper').height());
        $('.rightSidebar').height($('.mainWrapper').height());
        $('.chatbox').height($('.rightSidebar').height());
        $('#messageContainer').height($('.chatbox').height()-$('.chatbox').children('form').height());
        $('.SCResults').height($('.contentWrapper').height()-85);
        $('.management').height($('.contentWrapper').height()-85);
        $('.usergrp').height($('.management').height());
        $('.songQueue').height($('.leftMenu').height()-$('.leftBtns').height()-$('.logo').height()-35);
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