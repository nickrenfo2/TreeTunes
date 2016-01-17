var mongoose = require('mongoose');
//require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var SongSchema = new Schema({
    id:String,
    source:String,
    title:String,
    duration:Number
});

var song = mongoose.model('Song',SongSchema);

module.exports = song;