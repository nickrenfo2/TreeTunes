var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;

var MenuBtnSchema = new Schema({
    icon:String,
    action:String,
    title:String
});

var btn = mongoose.model('MenuBtn',MenuBtnSchema);

module.exports = btn;