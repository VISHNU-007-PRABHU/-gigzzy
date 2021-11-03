// grab the things we need
const mongoose = require('mongoose');
const moment = require("moment");
mongoose.set('useFindAndModify', false);
var mongoosePaginate = require('mongoose-paginate-v2');
//create schemaOptions
var schemaOptions = {
    toObject: {
        virtuals: true
    }
    , toJSON: {
        virtuals: true
    },
    timestamps: true
};

const extraSchema = mongoose.Schema({
    booking_id: {type: mongoose.Schema.Types.ObjectId, ref: 'booking'},
    extra_fare: {type: String, default: 0.00  },
    extra_fare_reason: {type: String},
}, schemaOptions);

extraSchema.pre('save', function (next) {
    // get the current date
    var currentDate = moment();
    this.updated_at = currentDate;
    if (!this.created_at) {
          this.created_at = currentDate;
    }
    next();
});

extraSchema.virtual('created_date').get(function () {
    var created_date = moment(this.created_at);
    return created_date.format('DD/MM/YYYY');
});

extraSchema.plugin(mongoosePaginate);
mongoose.set('useCreateIndex', true);
module.exports = mongoose.model('Extra_fee', extraSchema);