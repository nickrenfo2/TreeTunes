var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
    user:String,
    timestamp:String
});

var sesh = mongoose.model('Session',SessionSchema);

module.exports = sesh;