/**
 * Created by Nick on 10/13/15.
 */
/// <reference path='./tsDefs.d.ts'/>
$(function () {
    console.log("Loaded Jquery");
    resizeMain();
    $(window).resize(function () {
        resizeMain();
    });
    function resizeMain() {
        $('.mainWrapper').height($(window).height());
        $('.leftMenu').height($('.mainWrapper').height());
    }
});
//# sourceMappingURL=jquibbles.js.map