/**
 * Created by Nick on 10/14/15.
 */
var express = require('express');
var router = express.Router();
//var SC = require('soundcloud');


router.get('/', function (req,res) {
    console.log('/soundcloud/ hit');

    res.sendStatus(200);
});



router.get('/scCallback', function (req,res) {
    console.log('/soundcloud/scCallback');
    res.sendStatus(200);
});

module.exports = router;