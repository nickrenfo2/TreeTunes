/// <reference path="../typings/angularjs/angular.d.ts"/>

interface ILeftMenuBtn {
    icon:String,
    action:any,
    title:String
}

interface ICustomScope extends ng.IScope {
    itworks:String,
    leftMenuBtns: ILeftMenuBtn[],
    newSong:String,
    searchSong:Function,
    curSong:Object,
    history:Array
}
