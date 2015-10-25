/**
 * Created by Nick on 10/21/15.
 */
app.controller('ChatboxController',Chatbox);


function Chatbox() {
    console.log('chatboxcontroller');
    this.history = [];
    this.placeholder = 'Please log in to chat';
    this.botName = 'BBot';
    //this.socket;
    this.ioConnString = 'http://localhost:5000';
    this.lastMsgUsr = '';
    this.chatMsg = '';
    this.getUser = function(){
        //return $cookies.get('user');
        return readCookie('user');
    };
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    if(this.getUser()){
        console.log('logged in');
        this.connect();
    }
}

Chatbox.prototype.test = function(){
    console.log('something');
    console.log(this.history);
};

Chatbox.prototype.connect = function(){
    var hist = this.history;
    var botName = this.botName;
    this.socket = io().connect(this.ioConnString,{
        query:'session_id='+this.getUser()
    });

    this.socket.on('chat',function(msg){
        console.log('chattin');
        pushMessage(msg.user,msg.msg);


        //$scope.messageHistory.push(msg);
        //$scope.apply();
    });
    this.socket.on('conn',function(usr){
        //this.lastMsgUser = '';
        console.log('connected user:',usr);
        var message = usr + " has joined.";
        //var message =  "someone has joined.";
        pushMessage(botName,message);
    });
    this.socket.on('dc',function(usr){
        var message = usr+' has left.';
        pushMessage(botName,message);
    });
    this.socket.on('advance',function(){
        console.log('advance recieved');
        //this.$parent.advanceSong();
    });

    function pushMessage(usr,msg){
        if (this.lastMsgUsr == usr){
            var histLen = hist.length;
            hist[histLen-1].messages.push(msg);
        } else {
            this.lastMsgUsr = usr;
            hist.push({user:usr,messages:[msg]});
        }
        console.log(hist);
    }
};
Chatbox.prototype.sendChat = function(){
    //console.log('sending message: ',this.chatMsg);
    if (!this.socket.connected) this.connect();
    this.socket.emit('chat',this.chatMsg);
    this.chatMsg = '';
    return false;
};