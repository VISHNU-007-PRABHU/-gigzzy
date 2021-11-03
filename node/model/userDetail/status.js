var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

//create user schema 

var statusSchema = new Schema({
  
});

  var status = mongoose.model('status', statusSchema );

  module.exports = status;