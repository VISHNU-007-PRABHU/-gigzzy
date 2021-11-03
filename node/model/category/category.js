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
  , toJSON: {
    virtuals: true
  }
};

var categorySchema = new mongoose.Schema({
  category_name: { type: String, },
  description: { type: String },
  image: { type: String },
  base_price: { type: String, default: 0.00 },
  hour_price: { type: String, default: 0.00 },
  hour_limit: { type: String,default: "0" },
  day_price: { type: String, default: "0.00" },
  day_limit: { type: String, default: "0" },
  price_type: { type: String, default: "job" },
  gst: { type: String, default: 0.00 },
  description: { type: String },
  service_fee: { type: String, default: 0 },
  certificates: [],
  created_at: { type: String },
  update_at: { type: String },
  image: { type: String },
  is_parent: { type: Boolean, default: true },    // 1 == category ,2 == sub_category
  is_future: { type: Boolean, default: false },       // 1 == future , 2 == not future
  is_block: { type: Boolean, default: false },       // 1 == show , 2 == not show
  category_type: { type: Number, default: 1 },     // 1 is category ,2 is subcategory
  delete: { type: Number, default: 0 },
}, schemaOptions);

categorySchema.virtual('img_url').get(function () {
  if (this.image) {
    return commonHelper.getBaseurl() + '/images/category/' + this.image
  } else {
    return commonHelper.no_image;
  }
});


categorySchema.virtual('small_img_url').get(function () {
  if (this.image) {
    return commonHelper.getBaseurl() + '/images/category/' + this.image
  } else {
    return commonHelper.no_image;
  }
});

categorySchema.virtual('child', {
  ref: 'sub_category',
  localField: '_id',
  foreignField: 'category_id',
  justOne: false
});

categorySchema.virtual('uid').get(function () {
  return this._id;
});

categorySchema.pre('save', function (next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

categorySchema.virtual('created_date').get(function () {
  var created_date = moment(this.created_at);
  return created_date.format('DD/MM/YYYY');
});

categorySchema.plugin(mongoosePaginate);
var category = mongoose.model('category', categorySchema);

module.exports = category;