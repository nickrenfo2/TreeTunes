/**
 * Created by Nick on 10/28/15.
 */
var mongoose = require('mongoose');

var VoteSchema = new mongoose.Schema({
    username:String,
    userId:String,
    points:Boolean,
    songId:String
});

var vote = mongoose.model('Vote',VoteSchema);

module.exports = vote;