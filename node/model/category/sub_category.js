var mongoose = require('mongoose');
const moment = require("moment");
const mongoosePaginate = require('mongoose-paginate-v2');
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

var sub_categorySchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
  subCategory_name: { type: String },
  base_price: { type: String, default: 0.00 },
  hour_price: { type: String, default: 0.00 },
  hour_limit: { type: String,default: "0" },
  day_price: { type: String, default: "0.00" },
  day_limit: { type: String, default: "0" },
  price_type: { type: String, default: "job" },
  service_fee: { type: String, default: 0 },
  description: { type: String },
  certificates: [],
  created_at: { type: String },
  update_at: { type: String },
  image: { type: String },
  is_future: { type: Boolean, default: false },       // 1 == future , 2 == not future
  is_parent: { type: Boolean, default: false },       // 1 == future , 2 == not future
  is_block: { type: Boolean, default: false },       // 1 == show , 2 == not show
  category_type: { type: Number, default: 2 },       // type 1 is category ,2 is subcategory
  delete: { type: Number, default: 0 },
}, schemaOptions);

sub_categorySchema.virtual('img_url').get(function () {
  if (this.image) {
    return commonHelper.getBaseurl() + '/images/subcategory/' + this.image
  } else {
    return commonHelper.no_image;
  }
});

sub_categorySchema.virtual('small_img_url').get(function () {
  if (this.image) {
    return commonHelper.getBaseurl() + '/images/subcategory/' + this.image
  } else {
    return commonHelper.no_image;
  }
});


sub_categorySchema.virtual('uid').get(function () {
  return this._id;
});

sub_categorySchema.pre('save', function (next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

sub_categorySchema.virtual('created_date').get(function () {
  var created_date = moment(this.created_at);
  return created_date.format('DD/MM/YYYY');
});

sub_categorySchema.plugin(mongoosePaginate);
var sub_category = mongoose.model('sub_category', sub_categorySchema);
module.exports = sub_category;