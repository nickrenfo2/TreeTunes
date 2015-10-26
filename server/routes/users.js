/**
 * Created by Nick on 10/16/15.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../../models/user');

router.get('/', function(req, res, next) {
    console.log(req);
    res.json(req.isAuthenticated());
    //console.log(res);
});

router.get('/all', function (req,res) {
    if(!req.isAuthenticated()){
        res.sendStatus(401);
    } else if (req.user.role !='admin' && req.user.role != 'host'){
        res.sendStatus(401);
    } else {
        User.find({},'username role', function (err,users) {
            //var safeUsers = [];
            //for (var i=0;i<usrs.length;i++){
            //    safeUsers.push({username:usrs[i].username,role:usrs[i].role})
            //}
            //res.json(safeUsers);
            res.json(users);
        });
    }

    function cleanUser(usr){
        return {username:usr.username,role:user.role}
    }
});

router.post('/role', function (req,res) {

    //The user requesting the change. req.user is placed there through Passport's authentication, available in any request to the server
    console.log(req.user);
    //The person I'm making a change to. I pass this myself in my request the the server (when making my POST call)
    console.log(req.body);
    //Setting shorthand variables
    var usrRole = req.user.role;
    var newRole = req.body.role;
    //If the user does not have the permissions, simply send back a "401 Unauthorized" status
    if(usrRole == 'listener' || usrRole == 'dj')
        res.sendStatus(401);
    else if (usrRole == 'host' && newRole == 'host')
        res.sendStatus(401);
    else if (usrRole == 'host' && newRole == 'admin')
        res.sendStatus(401);
    //Otherwise, make the requested change.
    //Update will find a particular entry, then modify it with the given changes, then finally call the callback function
    else User.update({_id:req.body._id},{role:req.body.role},function(err,usr){});
});

router.get('/logout',function(req,res){
    console.log('redir to logout');

});

module.exports = router;