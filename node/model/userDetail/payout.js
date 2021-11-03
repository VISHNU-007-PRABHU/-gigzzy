var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");

var Schema = mongoose.Schema;
var schemaOptions = {
  toObject: {
    virtuals: true
  }
  , toJSON: {
    virtuals: true
  }
};
//create payout schema 
var payoutSchema = new Schema({
  provider_id: { type:String},
  booking_id: { type: String },
  amount: { type: String, default: 0.00 },
  status: { type: Number, default: 1 },
  booking_status:{type:Number,default:0},
  created_at:{type:Date}
}, schemaOptions);

payoutSchema.virtual('created_date').get(function () {
  var created_date = moment(this.created_at);
  return created_date.format('DD/MM/YYYY');
});

payoutSchema.pre('save', function (next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});
var payout = mongoose.model('payout', payoutSchema);
module.exports = payout;