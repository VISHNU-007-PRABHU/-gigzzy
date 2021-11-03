var mongoose = require('mongoose');
const moment = require("moment");
const commonHelper = require('../../graphql/commonHelper');
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;
var schemaOptions = {
  toObject: {
    virtuals: true
  }
  , toJSON: {
    virtuals: true
  },
  timestamps: true
};
//create user schema 

var bookingSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: false },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', unique:false },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'category', unique: false },
  category_type: { type: Number },  // 1-parent category , 2-sub category
  booking_ref: { type: String },
  booked: { type: String },
  location: {
    type: { type: String },
    coordinates: []
  },
  booking_status: { type: Number },  // 12.booking,11.user_cancel,8.provider_accept,no_provider],10.user_accept,4.start,13.end,14.completed,15.not available
  availability: [],
  hours: { type: String },
  booking_date: Date,
  booking_cron_date: String,
  booking_time: String,
  booking_hour: String,
  start_date: String,
  end_date: String,
  data: [{}],
  base_price: { type: String, default: 0.00 },
  hour_price: { type: String, default: "0.00" },
  extra_price: { type: String, default: 0.00 },
  extra_price_reason: { type: [String] },
  total: { type: String, default: 0.00 },
  hour_limit: { type: String, default: "0" },
  price_type: { type: String, default: "job" },
  day_price: { type: String, default: "0.00" },
  day_limit: { type: String, default: "0" },
  service_fee: { type: String, default: 0.00 },
  admin_fee: { type: String, default: 0.00 },    //admin fee
  provider_fee: { type: String, default: 0.00 }, //provider fee
  final_payment: { type: String, default: 0.00 },
  extra_hour_price: { type: String, default: 0.00 },
  description: { type: String },
  job_status: { type: Number },    //0.start,10.pending,4.ongoing,13.end,14.completed
  jobStart_time: { type: Date },
  jobEnd_time: { type: Date },
  total_time: { type: String },
  available_provider: [{ type: mongoose.Schema.Types.ObjectId, ref: 'detail' }],
  user_image: [],
  start_job_image: [],
  end_job_image: [],
  charge_id: { type: String },
  provider_rating: { type: Number, default: 0 },
  provider_comments: { type: String },
  user_rating: { type: Number, default: 0 },
  user_comments: { type: String, default: "" },
  user_comments_status: { type: Number, default: 0 },
  user_rating_status:{ type: Number, default: 0 },
  provider_rating_status:{ type: Number, default: 0 },
  payment_status: { type: Number, default: 0 }, // 0.base_price_pending,1.base_price_paid,2.refund success,3.refund failed,4.transaction_pending,5.completed
  booking_type: { type: Number, default: 1 },//1.now,2,later
  created_at: Date,
  booking_alert: { type: Number, default: 0 },
  end_date: Date,
  accept_date: Date,
  phone_number:{type:String,default:""},
  user_msg_is_read:{type:Number,default:0},
  provider_msg_is_read:{type:Number,default:0},
  user_msg_count:{type:Number,default:0},
  provider_msg_count:{type:String,default:0},
  MerchantRequestID:{ type: String, default: "" },
  CheckoutRequestID:{ type: String, default: "" },
  resultcode:{ type: String, default: 0 },
  TransactionDate:Date,
  MpesaReceiptNumber:{ type: String, default: 0 },
  payment_message:{type:String,default:""},
  mpeas_payment_callback:{ type: Boolean, default: false },
  manual_payment_status:{ type: Boolean, default: false },
  payment_type:{ type: String, default: "" },
  ctob_shotcode:{ type: String, default: "" },
  ctob_billRef:{ type: String, default: "" },
}, schemaOptions);

bookingSchema.virtual('uid').get(function () {
  return this._id;
});

bookingSchema.pre('save', function (next, doc) {
  // get the current date
  var currentDate = moment.utc();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});


bookingSchema.virtual('user_image_url').get(function () {
  if (this.user_image.length > 0) {
    var img = [];
    for (let i = 0; i < this.user_image.length; i++) {
      var data = commonHelper.getBaseurl() + '/images/booking/' + this.user_image[i]
      img.push(data);
    }
    return img
  } else {
    var img = [];
    var data = commonHelper.getBaseurl() + '/images/public/no_img.png';
    img.push(data);
    return img;
  }
});

bookingSchema.virtual('start_job_image_url').get(function () {
  if (this.start_job_image.length > 0) {
    var img = [];
    for (let i = 0; i < this.start_job_image.length; i++) {
      var data = commonHelper.getBaseurl() + '/images/booking/' + this.start_job_image[i]
      img.push(data);
    }
    return img
  } else {
    var img = [];
    return img;
  }
});

bookingSchema.virtual('end_job_image_url').get(function () {
  if (this.end_job_image.length > 0) {
    var img = [];
    for (let i = 0; i < this.end_job_image.length; i++) {
      var data = commonHelper.getBaseurl() + '/images/booking/' + this.end_job_image[i]
      img.push(data);
    }
    return img
  } else {
    var img = [];
    return img;
  }
});

bookingSchema.virtual('created_date').get(function () {
  var created_date = moment(this.created_at);
  return created_date.format('DD/MM/YYYY');
});

bookingSchema.virtual('bookingDate').get(function () {
  var created_date = moment(this.booking_date);
  if (this.booking_type == 1) {
    return created_date.format('DD/MM/YYYY hh:mm a');
  } else if (this.booking_type == 2) {
    return `${created_date.format('DD/MM/YYYY')} ${this.booking_time}`;
  }
});

bookingSchema.virtual('job_start_time').get(function () {
  if (this.jobStart_time) {
    return this.jobStart_time;
  } else {
    return ''
  }
});

bookingSchema.virtual('lat').get(function () {
  if (this.location.coordinates) {
    return this.location.coordinates[1];
  }
});
bookingSchema.virtual('lng').get(function () {
  if (this.location.coordinates) {
    return this.location.coordinates[0];
  }
});

bookingSchema.virtual('job_end_time').get(function () {
  if (this.jobEnd_time) {
    return this.jobEnd_time;
  } else {
    return ''
  }
});

bookingSchema.virtual('actual_time').get(function () {
  if (this.booking_status == 13 || this.booking_status == 14) {
    var start = moment(this.jobStart_time);
    var end = moment(this.jobEnd_time);
    var duration = moment.duration(end.diff(start));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) - hours * 60;
    return `${hours} hour : ${minutes} minutes`;
  } else {
    return 'on going';
  }
});


var booking = mongoose.model('booking', bookingSchema);

module.exports = booking;
