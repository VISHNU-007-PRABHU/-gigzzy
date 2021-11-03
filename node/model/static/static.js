var mongoose = require('mongoose'); 
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require("moment");
const commonHelper = require('../../graphql/commonHelper');
mongoose.set('useFindAndModify', false);
//create schemaOptions
var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };

var Schema = mongoose.Schema;

//create user schema 

var staticSchema = new Schema({
    page_name:{type:String},
    description:{type:String},
    title:{type:String},
    page_code:{type:String},
    status:{type:String,default:true},
    delete:{type:Number,default:0}

}, schemaOptions);


staticSchema.plugin(mongoosePaginate);

  var static = mongoose.model('static', staticSchema );

  module.exports = static;
