var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    role:String,
    username:String,
    password:String
});

var usr = mongoose.model('User',UserSchema);

module.exports = usr;