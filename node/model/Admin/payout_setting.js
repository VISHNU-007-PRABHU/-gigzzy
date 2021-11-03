var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create payout schema 
var payout_settingSchema = new Schema({
    user_name:String,
    password:String,
    secret_key:String,
    client_key:String,
    signature:String,
    payout_status:{type:Number,default:0}
});

var payout_setting = mongoose.model('payout_setting', payout_settingSchema);
module.exports = payout_setting;