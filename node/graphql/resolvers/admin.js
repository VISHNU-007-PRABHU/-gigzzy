const model = require('../../model_data');
var moment = require("moment");
var ObjectId = require('mongodb').ObjectID;
var Category_model = model.category;
var subCategory_model = model.sub_category;
var User_model = model.user;
var Status_model = model.status;
var Detail_model = model.detail;
var Booking_model = model.booking;
var Payout_model = model.payout;
var Extra_model = model.Extra_fee;
var Admin_model = model.admin;

module.exports.adminlogin = async (_, args) => {
    // console.log(args);
    const preview_admin = await Admin_model.find({});
    if (preview_admin.length == 0) {
        const frist_admin_data = {
            email: 'info@gigzzy.com',
            password: 'gigzzy',
            user_name: 'gigzzy',
        }
        let add_frist_admin = new Admin_model(frist_admin_data);
        const save = await add_frist_admin.save();
    }
    const admin_email = await Admin_model.find({ email: args.email });
    if (admin_email.length > 0) {
        const admin = await Admin_model.find({ email: args.email, password: args.password });
        if (admin != 0) {
            var data = { ...admin[0]._doc, ... { info: { msg: 'Login Success', status: "success" } } }
            return data;
        } else {
            return { info: { msg: "Invalid Password", status: "failed" } };
        }
    } else {
        return { info: { msg: "Invalid Email", status: "failed" } };
    }
}

//booking chart
module.exports.get_booking_chart = async (root, args) => {

    var option = args.option || 1;
    var pipeline = [];

    if (Number(option) == 1) {
        // All data
        pipeline = [
            { $match: { booking_status: { $in: [10, 4, 13, 14] } } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    } else if (Number(option) == 2) {
        // current  week
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, week: { $week: '$created_at' } } },
            { $match: { booking_status: { $in: [10, 4, 13, 14] }, week: moment().week() - 1 } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    } else if (Number(option) == 3) {
        // current  month
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, month: { $month: '$created_at' } } },
            { $match: { booking_status: { $in: [10, 4, 13, 14] }, month: moment().month() + 1 } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    }
    else if (Number(option) == 4) {
        // current  year
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, year: { $year: '$created_at' } } },
            { $match: { booking_status: { $in: [10, 4, 13, 14] }, year: moment().year() } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    }

    var data = await Booking_model.aggregate(pipeline);
    // console.log(data);
    // console.log(data.length);
    return data
};


//cancel chart
module.exports.get_cancel_chart = async (root, args) => {

    var option = args.option || 1;
    var pipeline = [];

    if (Number(option) == 1) {
        // All data
        pipeline = [
            { $match: { booking_status: { $in: [15, 11, 8, 9] } } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    } else if (Number(option) == 2) {
        // current  week
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, week: { $week: '$created_at' } } },
            { $match: { booking_status: { $in: [15, 11, 8, 9] }, week: moment().week() - 1 } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    } else if (Number(option) == 3) {
        // current  month
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, month: { $month: '$created_at' } } },
            { $match: { booking_status: { $in: [15, 11, 8, 9] }, month: moment().month() + 1 } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    }
    else if (Number(option) == 4) {
        // current  year
        pipeline = [
            { $project: { _id: 1, booking_status: 1, count: 1, created_at: 1, year: { $year: '$created_at' } } },
            { $match: { booking_status: { $in: [15, 11, 8, 9] }, year: moment().year() } },
            { $group: { _id: "$booking_status", count: { $sum: 1 } } },
        ];
    }

    var data = await Booking_model.aggregate(pipeline);
    //console.log(data);
    //console.log(data.length);
    return data
};



//earnings chart
module.exports.get_earnings_chart = async (root, args) => {
    var pipeline = [];
    pipeline = [
        { $project: { _id: 1, booking_status: 1, count: 1, admin_fee: 1, created_at: 1, year: { $year: new Date() }, month: { $month: '$created_at' } } },
        { $match: { admin_fee: { $ne: 'NaN' }, booking_status: { $in: [14] }, year: moment().year() } },
        { $group: { _id: "$month", total: { $sum: { "$toDouble": "$admin_fee" } } } },
        { $sort: { _id: 1 } }
    ];

    var data = await Booking_model.aggregate(pipeline);
    // console.log(data);
    // console.log(data.length);
    return data
};



//others chart
module.exports.get_others_chart = async (root, args) => {

    var pipeline = [];
    var data = [];

    pipeline = [
        { $project: { _id: 1, booking_status: 1, count: 1, admin_fee: 1, total: 1 } },
        { $match: { total: { $ne: 'NaN' }, booking_status: { $in: [14] } } },
        { $group: { _id: 1, revenue: { $sum: { "$toDouble": "$admin_fee" } }, earning: { $sum: { "$toDouble": "$total" } } } },
    ];
    var complete_data = await Booking_model.count({ booking_status: 14 });
    // console.log("module.exports.get_others_chart -> complete_data", complete_data)
    if (complete_data > 0) {
        var data = await Booking_model.aggregate(pipeline);
        // console.log("module.exports.get_others_chart -> data", data)
    } else {
        var revenue_count = { revenue: "0.00", earning: "0.00" };
        data.push(revenue_count);
    }

    var user = await Detail_model.count({ role: 1, delete: 0 });
    var provider = await Detail_model.count({ role: 2, delete: 0 });
    var data_count = { "user": user, "provider": provider };
    if (data.length == 0) {
        data.push(data_count);
    } else {
        data[0].user = user;
        data[0].provider = provider;
    }
    return data;
};

