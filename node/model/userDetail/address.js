// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
const crypto = require("crypto");
var mongoosePaginate = require('mongoose-paginate-v2');
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

/**
 * User schema
 */
const addressSchema = new  mongoose.Schema({
    user_id: String,
    title: String,
    flat_no: String,
    landmark: String,
    address: String,
    lat: String,
    lng: String,
    city: String,
    state: String,
    country: String,
    zip_code: String,
    distance:{
      type:String,
      default:"0km"
    },
    is_default:{
      type:Number,
      default:0
    },
    created_at: Date,
    updated_at: Date,
    delete:{type:Number,default:0}
}, schemaOptions);
// on every save, add the date
addressSchema.pre('save', function(next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at)
  {
    this.created_at = currentDate;
  }
  next();
});

module.exports = mongoose.model('address',addressSchema);
