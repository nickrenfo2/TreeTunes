var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var MenuBtn = require('../models/menuBtn');
//var soundCloud = require('./routes/soundcloud');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('../models/user');
var bodyParser = require('body-parser');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var sockets = require('./sockets/sockets')(io);
var passportSocketIo = require('passport.socketio');


var login = require('./routes/loginFn');

var userRoute = require('./routes/users');

var register = require('./routes/register');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(express.static(path.join(__dirname,"/public")));

//app.use('/soundcloud',soundCloud);


//var btn = new MenuBtn();
//btn.action = 'console.log("Button1")';
//btn.icon = 'chrome';
//btn.title = 'Button 1';
//btn.role = ['listener'];
//var btn2 = new MenuBtn();
//btn2.action = 'alert("Button2")';
//btn2.icon = 'certificate';
//btn2.title = 'Button 2';
//btn2.role = ['listener','dj'];
//
//btn.save();
//btn2.save();


//switch between local and remote DB
var connString = 'mongodb://localhost/treeTunes';
//var connString = 'mongodb://testAdmin:PoopyPants@ds039504.mongolab.com:39504/treetunes';
mongoose.connect(connString);


app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 600000, secure: false, httpOnly:false },
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
//ALL ROUTING BELOW

app.get('/', function (req, res) {
    //console.log(req.user);
    res.sendFile(path.join(__dirname,'./public/views/index.html'));
});

//app.post('/',
//    passport.authenticate('local', {
//        successRedirect: '/',
//        failureRedirect: '/'
//    })
//);
app.post('/login', function(req, res, next) {
    login(req,res,next);
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