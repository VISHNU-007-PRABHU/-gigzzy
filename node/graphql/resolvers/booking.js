var moment = require("moment");
const model = require('../../model_data');
// const { PubSub } = require('apollo-server');
var ObjectId = require('mongodb').ObjectID;
var CronJob = require('cron').CronJob;
var commonHelper = require('../commonHelper');
var round = require('mongo-round');
// const pubsub = new PubSub();
var Category_model = model.category;
var subCategory_model = model.sub_category;
// var User_model = model.user;
// var Status_model = model.status;
var Detail_model = model.detail;
var Booking_model = model.booking;
var Payout_model = model.payout;
var Extra_model = model.Extra_fee;

// const MESSAGE_CREATED = 'MESSAGE_CREATED';
// const ACCEPT_MSG = 'ACCEPT_MSG';
//get booking based on pagination
module.exports.get_booking = async (root, args) => {
    //console.log(args);
    var limits = args.limit || 10;
    var pages = args.page || 1;
    var offset = Number(pages - 1) * Number(limits);
    delete args.limit;
    delete args.page;
    var total = await Booking_model.count(args);
    var pageInfo = { totalDocs: total, page: pages }
    var result = await Booking_model.find(args).sort({ created_at: -1 }).skip(Number(offset)).limit(Number(limits));
    return { data: result, pageInfo };
}

//get_payout based on pagination
module.exports.get_payout = async (root, args) => {
    var limit = args.limit || 10;
    var page = args.page || 1;
    var offset = Number(page - 1) * Number(limit);
    var filter = [];
    var project = {
        _id: 1,
        category_id: 1,
        category_type: 1,
        user_id: 1,
        provider_id: 1,
        img_url: 1,
        booking_ref: 1,
        booking_status: 1,
        provider_fee: 1,
        created_at: 1,
        bookingDate: 1,
        booking_date: 1
    };
    var wmatch = {
        provider_fee: { $ne: 'NaN' },
        provider_id: ObjectId(args.provider_id),
        booking_status: args.booking_status,
        weeks: Number(moment().tz('Asia/Kolkata').format('W')) - 1
    };
    var mmatch = {
        provider_fee: { $ne: 'NaN' },
        provider_id: ObjectId(args.provider_id),
        booking_status: args.booking_status,
        months: Number(moment().tz('Asia/Kolkata').format('M'))
    };
    var ymatch = {
        provider_fee: { $ne: 'NaN' },
        provider_id: ObjectId(args.provider_id),
        booking_status: args.booking_status,
        years: Number(moment().tz('Asia/Kolkata').format('Y'))
    };
    var total = [];
    if (args.option == 1) {
        //current weeek
        filter = [
            { $project: { ...project, weeks: { $week: { date: "$created_at", timezone: "Asia/Kolkata" } } } },
            { $match: wmatch },
            { $sort: { 'created_at': -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) }
        ];
        total = [{ $project: { ...project, weeks: { $week: { date: "$created_at", timezone: "Asia/Kolkata" } } } }, { $match: wmatch },]
    } else if (args.option == 2) {
        //current month
        filter = [
            { $project: { ...project, months: { $month: { date: "$created_at", timezone: "Asia/Kolkata" } } } },
            { $match: mmatch },
            { $sort: { 'created_at': -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) }
        ];
        total = [{ $project: { ...project, months: { $month: { date: "$created_at", timezone: "Asia/Kolkata" } } } }, { $match: mmatch },]
    } else if (args.option == 3) {
        //current year
        filter = [
            { $project: { ...project, years: { $year: { date: "$created_at", timezone: "Asia/Kolkata" } } } },
            { $match: ymatch },
            { $sort: { 'created_at': -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) }
        ]
        total = [{ $project: { ...project, year: { $year: { date: "$created_at", timezone: "Asia/Kolkata" } } } }, { $match: ymatch },]
    }
    let pipeline = [{
        $project: {
            _id: 1,
            provider_id: 1,
            booking_status: 1,
            provider_fee: 1,
            total_amount: 1
        }
    },
    {
        $match: {
            provider_id: ObjectId(args.provider_id),
            booking_status: 14,
            provider_fee: { $ne: 'NaN' },
        }
    },
    {
        $group: {
            _id: 1,
            'total_amount': { $sum: { "$toDouble": '$provider_fee' } },
        }
    },

    ];
    var total = await Booking_model.aggregate(total);
    var datas = await Booking_model.aggregate(pipeline);
    var data = await Booking_model.aggregate(filter);
    //console.log("Vishnu");
    //console.log(total);
    // console.log(datas[0]);
    var pageInfo = { totalDocs: total.length, page: args.page, total_amount: datas[0] ? String(parseFloat(datas[0].total_amount).toFixed(2)) : "0.00" }
    return { pageInfo, data };
}

// get_all_payout
module.exports.get_all_payout = async (root, args) => {
    var limit = args.limit || 10;
    var page = args.page || 1;
    var offset = Number(page - 1) * Number(limit);
    var filter = [];
    var project = { _id: 1, category_id: 1, category_type: 1, user_id: 1, provider_id: 1, total_amount: 1, img_url: 1, booking_ref: 1, booking_status: 1, provider_fee: 1, };
    var total = [];
    var match_query = {};
    if (args.provider_id) {
        match_query = { status: 1, booking_status: 14, provider_id: args.provider_id, amount: { $ne: 'NaN' } }
    } else {
        match_query = { status: 1, booking_status: 14,amount: { $ne: 'NaN' } }
    }
    let pipeline = [
        { $match: match_query },
        { $group: { _id: "$provider_id", 'total_amount': { $sum: { "$toDouble": '$amount' } } } },
        { $skip: Number(offset) },
        { $limit: Number(limit) }
    ];
    var data = await Payout_model.aggregate(pipeline);
    for (let i = 0; i < data.length; i++) {
        data[i].total_amount = String(parseFloat(data[i].total_amount).toFixed(2))
    }
    //console.log(data);
    var pageInfo = { totalDocs: total.length, page: args.page }
    return { pageInfo, data };
}

// get completed booking provider fee
module.exports.get_payout_detail = async (root, args) => {
    // console.log(args)
    var data = await Payout_model.find(args.data);
    return data;
}

// get completed booking provider fee
module.exports.pay_admin_to_provider = async (root, args) => {
    //console.log("admin payout");
    //console.log(args);
    var data = await Payout_model.updateMany(args, { status: 2 });
    if (data.n == data.nModified) {
        return { msg: "payout success", status: "success" };
    } else {
        return { msg: "payout failed", status: "failed" };
    }
}


//cancel booking
module.exports.update_manual_payment = async (parent, args) => {
    try {
        let update_params = { payment_status: 2, manual_payment_status: false }
        let cancelbooking = await Booking_model.update({ _id: args.booking_id }, update_params);
        return { status: "success", msg: "Manual refund success" } 
    } catch (error) {
        return { status: "failed", msg: "Manual refund failed" } 
    }
};
module.exports.find_payout_booking = async (parent, args) => {
    var data = await Booking_model.find({ _id: parent.booking_id });
    return data;
}

// get booking
module.exports.booking = async (parent, args, context, info) => {
    const result = await Booking_model.find(args);
    //console.log(result);
    //console.log(result.length);
    return result;
};



// available booking display in provider
module.exports.available_booking = async (parent, args, context, info) => {
    //console.log(args);
    const result = await Booking_model.find({ booking_status: args.booking_status, available_provider: { $in: [args._id] } });
    //console.log(result);
    //console.log(result.length);
    return result;
};

//delete booking
module.exports.deleteBooking = async (parent, args) => {
    var result = await Booking_model.remove(args);
    //console.log(result);
    return result;
};

//delete booking
module.exports.available_deleteBooking = async (parent, args) => {
    var result = await Booking_model.remove({ available_provider: { $in: [args._id] } });
    //console.log(result);
    return result;
};


//cancel booking
module.exports.cancelBooking = async (parent, args) => {
    //console.log(args);
    let cancelbooking = await Booking_model.update({ _id: args.id }, { status: "cancel" });
    //console.log(cancelbooking);
    return cancelbooking;
};

// start the job 
module.exports.start_job = async (parent, args) => {
    //console.log(args);
    var result = await Booking_model.update({ _id: args._id }, { job_status: args.job_status, jobStart_time: args.jobStart_time });
    //console.log(result);
    return result;
};

// end the job
module.exports.end_job = async (parent, args) => {
    //console.log(args);
    var booking_data = await Booking_model.findOne({ _id: args._id });
    //console.log(booking_data);
    var start_date = moment(booking_data.jobStart_time, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(args.jobEnd_time, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var days = duration.asHours();
    //console.log(days);
    var result = await Booking_model.update({ _id: args._id }, { job_status: args.job_status, jobEnd_time: args.jobEnd_time, total_time: days });
    //console.log(result);
    return result;
};


// get now job
module.exports.get_now_job = async (parent, args) => {
    //console.log(args);
    var booking_data = await Booking_model.find({ available_provider: { $in: [args._id] } });
    //console.log(booking_data);

    // for(let i=0;i<booking_data.length;i++){
    // }
    // var data = {
    //     provider: find_provider,
    //     category_id: args.category_id,
    //     category_type: args.type,
    //     user_id: args.user_id,
    //     user_parent: true,
    //     ...booking._doc,
    // }
    // var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: data });
};


// get_extra_fare
module.exports.get_extra_fare = async (parent, args) => {
    var extra_fare = await Extra_model.find({ booking_id: args.booking_id });
    return extra_fare;
};


module.exports.get_trending = async (parent, args) => {
    var data = [];
    var pipeline = [
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: "$category_id"
            }
        },
        { $limit: 5 }
    ];
    var booking_data = await Booking_model.aggregate(pipeline);
    for (let i = 0; i < booking_data.length; i++) {
        var category = await Category_model.find({ _id: booking_data[i], is_block: false });
        if (category.length == 0) {
            var sub_category = await subCategory_model.find({ _id: booking_data[i], is_block: false });
            if (sub_category.length != 0) {
                data = [...data, ...sub_category]
            }
        } else {
            data = [...data, ...category]
        }
    }

    return data
};

module.exports.addRating = async (parent, args, context, info) => {
    var data = {}
    if (args.role == 1) {
        data = {
            user_rating: args.rating,
            user_comments: args.comments,
            user_rating_status: 1,
        }
    } else if (args.role == 2) {
        data = {
            provider_rating: args.rating,
            provider_comments: args.comments,
            provider_rating_status: 1,
        }
    }
    var add_rating = await Booking_model.update({ _id: args.booking_id }, data, { new: true });
    if (add_rating.n == add_rating.nModified) {
        return { ...data, ... { msg: "Rating Update Successfully", status: "success" } };
    } else {
        return { ...data, ... { msg: "Rating Update Failed", status: "failed" } };
    }
}


//get reviews based on pagination
module.exports.get_review = async (root, args) => {
    var limits = args.limit || 10;
    var pages = args.page || 1;
    var offset = Number(pages - 1) * Number(limits);
    delete args.limit;
    delete args.page;
    var data = {};
    // console.log(args);
    if (args.data) {
        data = args.data
    } else {
        data = { booking_status: [13, 14] }
    }
    // console.log(data);
    var total = await Booking_model.count(data);
    var result = await Booking_model.find(data).sort({ created_at: -1 }).skip(Number(offset)).limit(Number(limits));
    var pageInfo = { totalDocs: total, page: pages }
    return { data: result, pageInfo };
}

//update reviews based on pagination
module.exports.update_booking_details = async (root, args) => {
    var result = await Booking_model.update({ _id: args.booking_id }, { user_comments_status: args.user_comments_status });
    if (result.n == result.nModified) {
        return { msg: "update success", status: "success" };
    } else {
        return { msg: "update failed", status: "failed" };
    }
}

/* 
    @params(booking_type:2,booking_status:10) // 2==later,10==user_accept
*/
const job_reminder = new CronJob('* * * * * *', async () => {
    // console.log("cron");
    // {_id:ObjectId('5e4bca6a26706a565e2dd4fe')}
    // var d = new Date();
    var h = moment.utc().format("HH");
    var m = moment.utc().format("mm");
    // console.log(h,m,moment.utc().format("YYYY-MM-DD"))
    var allow_query = {
        booking_cron_date: { '$lte': moment.utc().format("YYYY-MM-DD") },
        // booking_hour: String(h),
        booking_type: 2,
        booking_status: 10,
    }
    var allow_job = await Booking_model.find(allow_query);
    for (let i = 0; i < allow_job.length; i++) {
        var data = allow_job[i].booking_time.split(':');

        if (Number(allow_job[i].booking_hour) <= Number(h)) {
            if (Number(data[1]) <= Number(m)) {
                var update_allow_booking = await Booking_model.update({ _id: allow_job[i]._id }, { booking_alert: 2 }, { new: true });
            }
        }
    }
    var query = {
        booking_cron_date: moment.utc().format("YYYY-MM-DD"),
        booking_hour: String(h),
        booking_type: 2,
        booking_alert: 0,
        booking_status: 10,
    }
    var booking = await Booking_model.find(query);
    // console.log('');
    for (let i = 0; i < booking.length; i++) {
        var data = booking[i].booking_time.split(':');
        var minutes = Math.abs(Number(m) - Number(data[1]));
        if (Number(minutes) <= 15) {
            let user_detail = await Detail_model.findOne({ _id: booking[i].provider_id });
            var email = await commonHelper.send_mail_sendgrid(user_detail.email,"schedule_job",{msg:'your next job almost ready ..'});
            await commonHelper.send_sms(user_detail.country_code, user_detail.phone_no, "scheduled_job", {})
            // (to provider)
            var message = {
                to: user_detail.device_id,
                notification: {
                    title: 'Job Reminder',
                    body: "your next job almost ready .. ",
                    click_action: ".activities.HomeActivity",
                },
                data: {
                    my_key: commonHelper.pending,
                    my_another_key: commonHelper.pending,
                    booking_id: booking[i]._id
                }
            };
            var msg = await commonHelper.push_notifiy(message);
            var update_booking = await Booking_model.update({ _id: booking[i]._id }, { booking_alert: 1 }, { new: true });
        }
    }
});
job_reminder.start();

