/**
 * Created by Nick on 10/16/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../../models/user');
var login = require('./loginFn');

router.get('/', function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

router.post('/', function(req,res,next) {
    //console.log(req.body);

    var pass = req.body.password;
    var upper = /[A-Z]+/.test(pass);
    var lower = /[a-z]+/.test(pass);
    var num = /[0-9]+/.test(pass);
    var special = /[!@#$%^(){}[\]~\-_:]+/.test(pass);

    if (upper && lower && num && special)
    req.body.role = 'listener';
    Users.create(req.body, function (err, post) {
        if (err)
            next(err);
        else
        login(req,res,next);
        //res.send('Account created');
    });
});

module.exports = router;
