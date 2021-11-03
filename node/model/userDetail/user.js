var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create user schema 

var userSchema = new Schema({
    role: { type: String, required: true }, // 1 == "user", 2=="provider"
    country_code: { type: String, require: true },
    phone_no: { type: String, required: true,},
    otp: { type: String },
    email_otp: { type: String }
}, { timestamps: true });

var user = mongoose.model('user', userSchema);

module.exports = user;