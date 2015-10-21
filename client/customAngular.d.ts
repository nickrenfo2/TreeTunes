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
    searchSound:Function,
    curSong:Object,
    history:Object[],
    toggleHistory:Function,
    loggingIn:Boolean,
    registerAcct:Function,
    alert:IAlertObj,
    acct:IAcct,
    historyOpen:Boolean,
    songProgressStyle: Object,
    songProgress:Number,
    Math:Math,
    login:Function,
    SCResults:Array,
    sendChat:Function,
    chatMsg:String,
    messageHistory:[String]
}
