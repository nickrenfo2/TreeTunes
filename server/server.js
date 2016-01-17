var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var MenuBtn = require('../models/menuBtn');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('../models/user');
var bodyParser = require('body-parser');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var sockets = require('sockets')(io);
var passportSocketIo = require('passport.socketio');

var login = require('./routes/loginFn');
var userRoute = require('./routes/users');
var register = require('./routes/register');
var queue = require('./routes/queue');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"/public")));



var btn = new MenuBtn();
btn.action = '$scope.skip';
btn.icon = 'forward';
btn.title = 'Skip';
btn.role = ['host','admin'];
btn.area = 'top';
//var btn2 = new MenuBtn();
//btn2.action = 'alert("Button2")';
//btn2.icon = 'certificate';
//btn2.title = 'Button 2';
//btn2.role = ['listener','dj'];
//
//btn.save();
//btn2.save();

//unbase = 'testing';
//pwbase = 'Test.me';
//
//for (var i=0;i<20;i++){
//    var usr = new User();
//    usr.username = unbase + i;
//    usr.password = pwbase + i;
//    usr.role = 'listener';
//    usr.save();
//}



//switch between local and remote DB
//var connString = 'mongodb://localhost/treeTunes';
var connString = 'mongodb://testAdmin:PoopyPants@ds039504.mongolab.com:39504/treetunes';
mongoose.connect(connString);

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: null, secure: false, httpOnly:false },
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));

io.use(passportSocketIo.authorize({
    //cookieParser:
    key:'user',
    secret:'secret',
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    success:onAuthorizeSuccess,
    fail:function(){console.log('ioAuthFail')}
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use('local', new localStrategy({
        passReqToCallback : true,
        usernameField: 'username'
    },
    function(req, username, password, done){
        User.findOne({ username: username }, function(err, user) {
            if (err) throw err;
            if (!user)
                return done(null, false, {message: 'Incorrect username or password.'});

            // test a matching password
            user.comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                if(isMatch)
                    return done(null, user);
                else
                    done(null, false, { message: 'Incorrect username or password.' });
            });
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
        if(err) done(err);
        done(null,user);
    });
});






//Route files here
app.use('/register', register);
app.use('/users',userRoute);
app.use('/queue',queue);
//ALL ROUTING BELOW

app.get('/', function (req, res) {
    //console.log(req.user);
    res.sendFile(path.join(__dirname,'./public/views/index.html'));
});

//app.get('/users/all', function (req,res) {
//    if(!req.isAuthenticated()){
//        res.sendStatus(401);
//    } else if (req.user.role !='admin' && req.user.role != 'host'){
//        res.sendStatus(401);
//    } else {
//        User.find({},'username role', function (err,users) {
//            //var safeUsers = [];
//            //for (var i=0;i<usrs.length;i++){
//            //    safeUsers.push({username:usrs[i].username,role:usrs[i].role})
//            //}
//            //res.json(safeUsers);
//            res.json(users);
//        });
//    }
//
//    function cleanUser(usr){
//        return {username:usr.username,role:user.role}
//    }
//});

//app.post('/login',
//    passport.authenticate('local', {
//        successRedirect: 'back',
//        failureRedirect: '/'
//    })
//);
app.post('/login', function(req, res, next) {
    login(req,res,next);
});

app.get('/logout', function (req,res) {
    console.log('logging out:',req.user.username);
    req.logout();
    //res.sendFile(path.join(__dirname,'/public/views/logout.html'));
    res.sendStatus(200);
});

app.get('/menuBtns', function (req,res) {
    //console.log('menu route hit');
    //console.log(req.user);
    if (req.isAuthenticated()) {
        MenuBtn.find({role:req.user.role}, function (err,btns) {
            //console.log(btns);
            res.send(JSON.stringify(btns));
        });
    }
    else {
        return res.sendStatus(401);
    }
});

app.get('/scCallback',function(req,res){
    console.log('/scCallback');
    res.sendStatus(200);
});


function onAuthorizeSuccess(data,accept){
    //console.log(data);
    //console.log(accept);
    //io.on('connection', function (socket) {
    //    console.log('a user connected');
    //});
    console.log('ioAuthSuccess');
    accept();
}


var server = http.listen(process.env.PORT || 5000, function () {
    console.log('Listening on port:',server.address().port);

});

module.exports = app;
