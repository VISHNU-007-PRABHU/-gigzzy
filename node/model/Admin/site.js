var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require("moment");
const commonHelper = require('../../graphql/commonHelper');
mongoose.set('useFindAndModify', false);
const env = process.env;

//create schemaOptions
var schemaOptions = {
  toObject: {
    virtuals: true
  }
  , toJSON: {
    virtuals: true
  }
};

var siteSchema = new mongoose.Schema({
  site_name: { type: String , default:"gigzzy" },
  site_email: { type: String ,default:"info@gigzzy.com" },
  img_logo: { type: String ,default:""},
  copyrights_content: { type: String,default:"Copy Right" },
  playstore_link: { type: String, default:""},
  appstore_link: { type: String ,default:""},
  contact_number: { type: String ,default:" +254 733 494 363"},
  contact_email: { type: String,default:"info@gigzzy.com" },
  site_currency: { type: String ,default:"KSH"},
  created_at: { type: String },
  update_at: { type: String },
  img_icon: { type: String,default:"" },
}, schemaOptions);

siteSchema.virtual('site_logo').get(function () {
  if (this.img_logo) {
    return commonHelper.getBaseurl() + '/images/public/' + this.img_logo
  } else {
    return env.APP_URL + '/images/public/no_img.png';
  }
});
siteSchema.virtual('site_icon').get(function () {
  if (this.img_icon) {
    return commonHelper.getBaseurl() + '/images/public/' + this.img_icon
  } else {
    return env.APP_URL + '/images/public/no_img.png';
  }
});

siteSchema.virtual('uid').get(function () {
  return this._id;
});

siteSchema.pre('save', function (next) {
  // get the current date
  var currentDate = moment();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

siteSchema.virtual('created_date').get(function () {
  var created_date = moment(this.created_at);
  return created_date.format('DD/MM/YYYY');
});

siteSchema.plugin(mongoosePaginate);
var site = mongoose.model('site', siteSchema);
module.exports = site;