/**
 * Created by Nick on 10/16/15.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req);
    res.json(req.isAuthenticated());
    //console.log(res);
});

module.exports = router;