/// <reference path="../typings/angularjs/angular.d.ts"/>

interface ILeftMenuBtn {
    icon:String,
    action:any,
    title:String
}

interface IAlertObj {
    message:String,
    status:String
}

interface IAcct{
    username:String,
    role:String,
    password:String,
    num:Boolean,
    upper:Boolean,
    lower:Boolean,
    special:Boolean,
    length:Boolean
}

interface ICustomScope extends ng.IScope {
    itworks:String,
    leftMenuBtns: ILeftMenuBtn[],
    newSong:String,
    searchSong:Function,
    curSong:Object,
    history:Object[],
    loggingIn:Boolean,
    registerAcct:Function,
    alert:IAlertObj,
    acct:IAcct
}
