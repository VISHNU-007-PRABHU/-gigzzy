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

const messageSchema = mongoose.Schema({
    message: String,
    booking_id: {type: mongoose.Schema.Types.ObjectId, ref: 'booking'},
    provider_id: {type: mongoose.Schema.Types.ObjectId,ref: 'detail' },
    user_id: {type: mongoose.Schema.Types.ObjectId,ref: 'detail'},
    message_date:String,
    role:{type:Number}
}, schemaOptions);

messageSchema.pre('save', function (next) {
    // get the current date
    var currentDate = moment.utc();
    this.updated_at = currentDate;
    if (!this.created_at) {
          this.created_at = currentDate;
    }
    next();
});

messageSchema.virtual('created_date').get(function () {
    var created_date = moment(this.created_at);
    return created_date.format('DD/MM/YYYY');
});

messageSchema.virtual('msg_date').get(function () {
    return this.message_date;
});

messageSchema.virtual('msg_time').get(function () {
    return this.message_date;
});

messageSchema.plugin(mongoosePaginate);
mongoose.set('useCreateIndex', true);
module.exports = mongoose.model('Message', messageSchema);