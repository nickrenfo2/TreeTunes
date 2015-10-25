/**
 * Created by Nick on 10/16/15.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
    console.log(req);
    res.json(req.isAuthenticated());
    //console.log(res);
});

router.get('/logout',function(req,res){
    console.log('redir to logout');

});

module.exports = router;