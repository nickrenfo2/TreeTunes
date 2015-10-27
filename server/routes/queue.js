/**
 * Created by Nick on 10/23/15.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var Song = require('../../models/song');
//var mongoose = require('mongoose');
var app = express();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
//var socket = require('socket.io-client');
//socket.connect('localhost:5000');
var io = require('socket.io-client');
socket = io.connect('localhost:5000');
socket.emit('test','foo');
socket.on('connection', function () {
    socket.emit('test','foo');
});

var song = new Song();
song.id = '4138540';
song.source = 'Soundcloud';

var curTime = 0;
var delay = 1000;
//var socket;

var advanceInterval;


router.get('/', function (req,res) {
    //song.save();
    Song.find({}, function (err,queue) {
        //console.log(btns);
        res.send(JSON.stringify(queue));
    });
});

router.get('/next', function (req,res) {
    Song.findOne({}, function (err,song) {
        if(song) {
            song.curTime = curTime;
            //console.log(song);
            //res.json(song);
            var mySong = {
                id: song.id,
                duration: song.duration,
                source: song.source,
                title: song.title,
                curTime: curTime
            };
            res.json(mySong);
        } else {
            res.send('No song queued');
        }
    });
});

router.get('/skip', function (req,res) {
    if(req.user.role == 'host' || req.user.role == 'admin') {
        clearInterval(advanceInterval);
        advance(true);
        return res.sendStatus(200);
    } else {
        return res.sendStatus(401);
    }
});

router.get('/kickoff', function (req,res) {
    //socket = io.connect('http://localhost:5000');
    advance(false);
    setInterval(function(){
        curTime+=delay;
        //console.log(curTime);
    },delay);
    res.sendStatus(200);
});

router.post('/add', function (req,res) {
    var newSong = new Song();
    newSong.id = req.body.id;
    newSong.duration = req.body.duration;
    newSong.source = 'Soundcloud';
    newSong.title = req.body.title;
    newSong.save();
    //console.log(req.body);
    res.sendStatus(200);
});

function advance(skip){
    //console.log('advancing song');
    var duration = 5000;
    curTime = 0;
    Song.findOne({}, function (err,rmSong) {
        //console.log(rmSong);
        if(rmSong) {
            if(skip) rmSong.remove();
            Song.findOne({}, function (err, song) {
                if (song) {
                    duration = song.duration;
                    console.log(duration);
                    //socket.emit('advance');
                    advanceInterval = setTimeout(advance, duration + 5000,true);
                }
            });
        }
    });
}

var myVar;

function changeTrack(duration) {
    myVar = setTimeout(changeTrack, duration);
}


//Start up the server immediately
advance(false);
setInterval(function(){
    curTime+=delay;
    //console.log(curTime);
},delay);

module.exports = router;