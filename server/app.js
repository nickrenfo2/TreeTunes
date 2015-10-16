var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var MenuBtn = require('../models/menuBtn');
var soundCloud = require('./routes/soundcloud');

app.use(express.static(path.join(__dirname,"/public")));

app.use('/soundcloud',soundCloud);


//var btn = new MenuBtn();
//btn.action = 'console.log("Button1")';
//btn.icon = 'chrome';
//btn.title = 'Button 1';
//var btn2 = new MenuBtn();
//btn2.action = 'alert("Button2")';
//btn2.icon = 'certificate';
//btn2.title = 'Button 2';
//
//btn.save();
//btn2.save();

mongoose.connect('mongodb://localhost/treeTunes');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'./public/views/index.html'));
});

app.get('/menuBtns', function (req,res) {
    //console.log('menu route hit');
    return MenuBtn.find({}).exec(function (err,btns) {
        if (err) throw new Error(err);
        res.send(JSON.stringify(btns));
    });
});

app.get('/scCallback',function(req,res){
    console.log('/scCallback');
    res.sendStatus(200);
});

var server = app.listen(process.env.PORT || 5000, function () {
    console.log('Listening on port:',server.address().port);

});

module.exports = app;