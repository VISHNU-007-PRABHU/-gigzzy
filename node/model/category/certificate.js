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

var certificateSchema = new mongoose.Schema({
    certificate_name: { type: String },
    description: { type: String },
    created_at: Date,
    updated_at: Date,
    delete: { type:Number, default: 0 },
}, schemaOptions);

  
certificateSchema.virtual('uid').get(function() {
    return this._id;
});

certificateSchema.pre('save', function (next) {
    // get the current date
    var currentDate = moment();
    this.updated_at = currentDate;
    if (!this.created_at) {
          this.created_at = currentDate;
    }
    next();
});

certificateSchema.virtual('created_date').get(function () {
    var created_date = moment(this.created_at);
    return created_date.format('DD/MM/YYYY');
});

certificateSchema.plugin(mongoosePaginate);
var certificate = mongoose.model('certificate', certificateSchema);

module.exports = certificate;