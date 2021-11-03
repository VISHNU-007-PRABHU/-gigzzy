const model = require('../model_data');
const { withFilter, PubSub } = require('apollo-server');
const _ = require('lodash');
const moment = require("moment");
const path = require("path");
var CronJob = require('cron').CronJob;
const pubsub = new PubSub();
const { createWriteStream } = require("fs");
var userResolver = require('./resolvers/user');
var categoryResolver = require('./resolvers/category');
var statusResolver = require('./resolvers/status');
var staticResolver = require('./resolvers/static');
var bookingResolver = require('./resolvers/booking');
var adminResolver = require('./resolvers/admin');
var certificateResolver = require('./resolvers/certificate');
var staticResolver = require('./resolvers/static');
var settingResolver = require('./resolvers/setting');
const dotenv = require('dotenv');
const commonHelper = require('../graphql/commonHelper');
const safaricom = require('../graphql/safaricom');
dotenv.config();

var Detail_model = model.detail;
var Booking_model = model.booking;
var subCategory_model = model.sub_category;
var Category_model = model.category;
var message_model = model.message;
var Payout_model = model.payout;
var Extra_fee_model = model.Extra_fee;
var providerSubcategory_model = model.providerSubcategory_model;

const MESSAGE_CREATED = 'MESSAGE_CREATED';
const ACCEPT_MSG = 'ACCEPT_MSG';
const BOOK_MSG = 'BOOK_MSG';
const TEST_MSG = 'TEST_MSG';
const SEND_JOB_MSG = 'SEND_JOB_MSG';
const SEND_ACCEPT_MSG = 'SEND_ACCEPT_MSG';
const APPOINTMENTS = 'APPOINTMENTS';
const PROOF_STATUS = 'PROOF_STATUS';
const REMOVE_USER = 'REMOVE_USER';

const resolvers = {

    Subscription: {
        test: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([TEST_MSG]),
                (payload, variables) => {
                    // console.log("Message created");
                    // console.log(payload);
                    // console.log(variables);
                    return true;
                })
        },

        demo_account: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([REMOVE_USER]),
                (payload, variables) => {
                    if (payload.demo_account._id == variables._id) {
                        return true;
                    }
                })
        },

        proof_status: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([PROOF_STATUS]),
                (payload, variables) => {
                    // console.log(payload);
                    if (payload.proof_status._id == variables._id) {
                        return true;
                    }
                })
        },

        messageSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([MESSAGE_CREATED]),
                (payload, variables) => {
                    // console.log(payload.messageSent.booking_id);
                    // console.log(variables);
                    if (payload.messageSent.booking_id == variables.booking_id) {
                        return true;
                    }
                })
        },

        get_my_appointments: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([APPOINTMENTS]),
                (payload, variables) => {
                    // console.log("Appointment MSG");
                    // console.log(payload.get_my_appointments);
                    // console.log(variables);
                    for (let i = 0; i <= payload.get_my_appointments.length; i++) {
                        //console.log("()()()()()()()()()");
                        if (payload.get_my_appointments[i].provider_id == variables._id) {
                            if (variables.booking_status === 10) {
                                return true;
                            }
                        }
                    }
                }),
        },

        send_accept_msg: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([SEND_ACCEPT_MSG]),
                (payload, variables) => {
                    // console.log("Accepted MSG");
                    // console.log(payload);
                    // console.log(payload.send_accept_msg.user_id);
                    if (payload.send_accept_msg.msg_status != undefined && payload.send_accept_msg.msg_status == 'to_provider') {
                        if (payload.send_accept_msg.provider_id == variables._id) {
                            console.log("msg to provider");
                            return true;
                        }
                    } else {
                        if (payload.send_accept_msg.user_id == variables._id) {
                            if (payload.send_accept_msg._id == variables.booking_id) {
                                console.log("msg to user user to cancel");
                                return true;
                            }
                        }
                    }
                }),
        },

        send_jobs_provider: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([SEND_JOB_MSG]),
                (payload, variables) => {
                    //console.log("sada");
                    for (let i = 0; i <= payload.send_jobs_provider.available_provider.length; i++) {
                        // console.log("()()()()()()()()()");
                        if (payload.send_jobs_provider.available_provider[i] == variables._id) {
                            // console.log("send successfull");
                            // var message = { 
                            //     to: 'registration_token', 
                            //     collapse_key: 'your_collapse_key',
                            //     notification: {
                            //         title: 'Title of your push notification', 
                            //         body: 'Body of your push notification' 
                            //     },

                            // };
                            // commonHelper.push_notifiy(message);
                            return true;
                        }
                    }
                }),
        },
        booking_details: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([BOOK_MSG]),
                (payload, variables) => {
                    // console.log("Soory MSG");
                    //console.log(payload);
                    //console.log(payload.booking_details._id);
                    //console.log(variables);
                    if (payload.booking_details._id == variables.booking_id) {
                        return true;
                    }
                }),
        }
    },


    // graphql query (find) function

    Query: {
        testmail: userResolver.testinfmail,
        // get data using pagination  
        get_user: userResolver.get_user,
        user_search: userResolver.user_search,
        get_category: categoryResolver.get_category,
        get_subcategory: categoryResolver.get_subcategory,
        get_certificate: certificateResolver.get_certificate,
        get_static: staticResolver.get_static,
        get_booking: bookingResolver.get_booking,
        get_message: staticResolver.get_message,
        get_all_payout: bookingResolver.get_all_payout,
        get_review: bookingResolver.get_review,

        user: userResolver.user,
        category: categoryResolver.category,
        check_demo_app: userResolver.check_demo_app,
        sub_category: categoryResolver.subcategory,
        status: statusResolver.status,
        details: userResolver.details,
        confirm_email: userResolver.confirm_email,
        // find_provider: bookingResolver.find_provider,
        search_category: categoryResolver.search_category,
        search_category_mobile: categoryResolver.search_category_mobile,
        search_category_only: categoryResolver.search_category_only,
        search_sub_category_only: categoryResolver.search_sub_category_only,
        get_now_job: bookingResolver.get_now_job,
        site_setting_detail: settingResolver.site_setting_detail,
        payout_setting_detail: settingResolver.payout_setting_detail,
        user_address: userResolver.user_address,
        get_my_appointments: async (parent, args, context, info) => {
            try {

                var data = {}
                //console.log(args);
                var limit = args.limit || 10;
                var page = args.page || 1;
                var offset = Number(page - 1) * Number(limit);
                if (args.role == 1) {
                    if (args.booking_status == 4) {
                        data = { user_id: args._id, booking_status: { $in: [13, 4] } };
                    } else {
                        data = { user_id: args._id, booking_status: args.booking_status };
                    }
                } else if (args.role == 2) {
                    if (args.booking_status == 12) {
                        data = { available_provider: { $in: [args._id] } }
                    } else {
                        if (args.booking_status == 4) {
                            data = { provider_id: args._id, booking_status: { $in: [13, 4] } };
                        } else {
                            data = { provider_id: args._id, booking_status: args.booking_status };
                        }

                    }
                }
                const result = await Booking_model.find(data).sort({ created_at: -1 }).skip(Number(offset)).limit(args.limit);
                // console.log("result", result)
                var total = await Booking_model.count(data);
                var pageInfo = { totalDocs: total, page: args.page }
                return { data: result, pageInfo };
            } catch (error) {
                return { data: [], pageInfo: { totalDocs: 0 } };
            }
        },

        checkOtp: userResolver.checkOtp,
        sign_up: userResolver.sign_up,
        booking: bookingResolver.booking,
        email_checkOtp: userResolver.email_checkOtp,
        resend_otp: userResolver.resend_otp,
        certificate: certificateResolver.certificate,
        static: staticResolver.static,
        get_extra_fare: bookingResolver.get_extra_fare,
        test: async (parent, args, context, info) => {
            await pubsub.publish(TEST_MSG, { test: { info: { message: "sd", status: "ok" } } });
        },
        get_payout: bookingResolver.get_payout,
        get_trending: bookingResolver.get_trending,
        get_is_future: categoryResolver.get_is_future,
        get_payout_detail: bookingResolver.get_payout_detail,
        get_booking_chart: adminResolver.get_booking_chart,
        get_cancel_chart: adminResolver.get_cancel_chart,
        get_earnings_chart: adminResolver.get_earnings_chart,
        get_others_chart: adminResolver.get_others_chart,
    },

    // Find sub_query under schema 
    Chat: {
        user: userResolver.user,
        provider: userResolver.user
    },
    Category: {
        booking_parent_category: categoryResolver.booking_parent_category,
        sub_category: categoryResolver.subcategory,
        child_category: categoryResolver.child_category, //display child categor based on parent _id 
        Certificate: certificateResolver.certificate,   //display certificate  based on category
    },
    subCategory: {
        category: categoryResolver.subcategory_category,
        Certificate: certificateResolver.certificate,  //display certificate  based on category
    },

    User: {
        detail: userResolver.details,
        category: categoryResolver.category,
        sub_category: categoryResolver.subcategory,

    },
    Detail: {
        category: categoryResolver.category,
        provider_rating: userResolver.provider_rating,
        provider_rate: userResolver.provider_rate,

    },

    Booking: {
        user: userResolver.user,
        booking_provider: userResolver.available_booking_povider,
        find_kilometre: userResolver.kilometer,
        booking_user: userResolver.available_booking_user,
        booking_category: categoryResolver.available_booking_category,
        get_my_appointments: bookingResolver.available_booking,
        get_booking_on_status: bookingResolver.booking,
        // payout:bookingResolver.get_total_payout,
        category: categoryResolver.booking_category,
        send_job_category: categoryResolver.send_job_category,
        // booking_payout:bookingResolver.get_payout,
        find_payout_provider: userResolver.find_payout_provider,
        find_payout_booking: bookingResolver.find_payout_booking,
        get_booking_message: staticResolver.get_message,

    },

    // graphql  Mutation  (add,update,delete) function 

    Mutation: {
        adminLogin: adminResolver.adminlogin,
        addUser: async (_, args) => {
            const user = await Detail_model.find({ role: args.role, phone_no: args.phone_no, delete: 0 });
            // console.log(user);
            //console.log("user");
            //add new user 
            if (args.option == "add") {
                const get_role = await Detail_model.find({ _id: args._id });
                //console.log(args.email);
                if (get_role[0].role == 1) {
                    args.role = 1;
                } else {
                    args.role = 2;
                }
                if (args.phone_no != '') {
                    if (args.phone_no != null) {
                        if (args.phone_no != undefined) {
                            const find_pn = await Detail_model.find({ delete: 0, phone_no: args.phone_no, role: args.role, _id: { $ne: args._id } });
                            if (find_pn.length > 0) {
                                return { msg: "mobile no exists", status: 'failed' }
                            }
                        }
                    }
                }
                if (args.email != '') {
                    if (args.email != null) {
                        if (args.email != undefined) {
                            const find_email = await Detail_model.find({ delete: 0, email: args.email, role: args.role, _id: { $ne: args._id } });
                            if (find_email.length > 0) {
                                return { msg: "Email already exists", status: 'failed' }
                            }
                        }
                    }
                }
                args.Upload_percentage = 50;
                if (get_role[0].role == 2) {
                    if (args.email != '') {
                        let otp = String(Math.floor(100000 + Math.random() * 900000));
                        args.email_otp = otp;
                        args.last_email_otp_verification = moment.utc().format();
                        var send_otp = await commonHelper.send_mail_sendgrid(args.email, 'otp', { otp });
                    }
                }
                if (args.old_password != undefined && args.old_password != '') {
                    if (args.old_password != get_role[0].password) {
                        return { ...args, "msg": "Wrong Current Password", status: "failed" };
                    }
                    else {
                        delete args.old_password;
                    }
                }
                if (args.lat != undefined && args.lng != undefined) {
                    args.location = { type: 'Point', coordinates: [args.lng, args.lat] };
                }

                var user_deails = await Detail_model.findOne({ _id: args._id });
                var preview_data = user_deails.provider_subCategoryID;
                var check_category = false;
                if (Array.isArray(args.provider_subCategoryID)) {
                    for (let i = 0; i < args.provider_subCategoryID.length; i++) {
                        check_category = preview_data.includes(args.provider_subCategoryID[i]);
                        if (!check_category) {
                            args.proof_status = 0;
                            var msg = "please wait for admin confrimation in new category";
                            // console.log('true')
                            // ================= push_notifiy ================== //
                            var message = {
                                to: user_deails.device_id,
                                collapse_key: 'your_collapse_key',
                                notification: {
                                    title: "Proof Status",
                                    body: msg,
                                    click_action: ".activities.HomeActivity",
                                },
                                data: {
                                    my_key: commonHelper.on_going,
                                    my_another_key: commonHelper.on_going
                                }
                            };
                            var msg_notification = await commonHelper.push_notifiy(message);
                            // ================= push_notifiy ================== //  
                            var send_verification = await commonHelper.send_mail_sendgrid(user.email, "admin_approved", { msg });
                            await commonHelper.send_sms(user_deails.country_code, user_deails.phone_no, "admin_apporved", {})
                            await pubsub.publish(PROOF_STATUS, { proof_status: 0, _id: args._id });
                            break;
                        }
                    }
                }

                const add_detail = await Detail_model.updateOne({ _id: args._id }, args);
                // console.log(add_detail);
                var data = await Detail_model.findOne({ _id: args._id });
                if (add_detail.n == add_detail.nModified) {
                    data.msg = "User Detail Sucessfully Updated";
                    data.status = "success";
                    //console.log(data);
                    return data
                } else {
                    data.msg = "User Detail Update  Process Failed";
                    data.status = "failed";
                    return data;
                }
            } else if (user.length == 0 && args.option == "otp") {

                let otp = String(Math.floor(1000 + Math.random() * 9000));
                args.otp = otp;
                args.last_otp_verification = moment.utc().format();
                args.Upload_percentage = 25;
                //console.log(args);
                const add_user = new Detail_model(args);
                await add_user.save();
                var data = await Detail_model.findOne({ role: args.role, phone_no: args.phone_no, delete: 0 });
                if (args.device_id != null && args.device_id != undefined && args.device_id != '') {
                    const add_detail = await Detail_model.updateOne({ _id: data._id }, { device_id: args.device_id });
                }
                await commonHelper.send_sms(data.country_code, data.phone_no, "otp", { otp })
                data.msg = "New User";
                data.status = "success";
                return data;
            } else if (args.phone_no == undefined || args.phone_no == '') {
                return { ...args, "msg": "Please Enter phone Number", status: "failed" };
            }
            else {
                //already insert and check the otp time and reset
                update_time = new Date(moment(user[0].last_otp_verification));
                current_time = new Date(moment.utc());
                let otp_time_diff = Math.round(Math.abs(current_time - update_time) / 60000, 2);
                // "otp is not change"
                var return_msg = {};
                var data = await Detail_model.findOne({ phone_no: args.phone_no, role: args.role, delete: 0 });
                if (args.device_id != null && args.device_id != undefined && args.device_id != '') {
                    const add_detail = await Detail_model.updateOne({ _id: data._id }, { device_id: args.device_id });
                }
                if (otp_time_diff <= 15) {
                    if (data.Upload_percentage == 25) {
                        data.msg = "New User"; data.status = 'success';
                    } else {
                        data.msg = "otp no change", data.status = 'failed';
                    }
                    // console.log({ ...data._doc, ...return_msg });
                    await commonHelper.send_sms(data.country_code, data.phone_no, "otp", { otp: data.otp })
                    return data;
                }
                //"otp is change"
                else {

                    let otp = String(Math.floor(1000 + Math.random() * 9000));
                    if (args.device_id != null && args.device_id != undefined && args.device_id != '') {
                        const update_opt_time = await Detail_model.updateOne({ phone_no: args.phone_no, role: args.role }, { device_id: args.device_id, otp: otp, last_otp_verification: moment.utc().format() });
                    } else {
                        const update_opt_time = await Detail_model.updateOne({ phone_no: args.phone_no, role: args.role }, { otp: otp, last_otp_verification: moment.utc().format() });
                    }
                    const update_result = await Detail_model.findOne({ phone_no: args.phone_no, role: args.role });
                    if (update_result.Upload_percentage == 25) {
                        update_result.msg = "New User"; update_result.status = 'success';
                    } else {
                        update_result.msg = "otp changed"; update_result.status = 'failed';
                    }
                    await commonHelper.send_sms(update_result.country_code, update_result.phone_no, "otp", { otp })
                    return update_result;
                }
            }
        },
        reset_password: userResolver.reset_password,
        admin_add_user: userResolver.admin_add_user,
        admin_update_user: admin_update_user = async (_, args) => {
            try {
                //console.log(args);
                if (args.lat && args.lng) {
                    args.location = { type: 'Point', coordinates: [args.lng, args.lat] };
                }
                if (args.country_code == '' || args.country_code == null) {
                    delete args.country_code;
                }
                if (args.demo != '' && typeof args.demo != "undefined" && args.demo != null && args.demo != false) {
                    args.Upload_percentage = "50%";
                    args.otp_verification = 1;
                    args.email_otp_verification = 1;
                    args.email_otp = String(Math.floor(100000 + Math.random() * 900000))
                    args.otp = String(Math.floor(100000 + Math.random() * 900000))
                    args.last_email_otp_verification = moment.utc().format();
                    args.last_otp_verification = moment.utc().valueOf();
                    // args.demo_end_time = moment.utc().add(5, 'minutes');
                    args.demo_end_time = moment.utc().add(4, 'days').format("YYYY-MM-DD");
                }

                var data = await Detail_model.findOne({ _id: args._id });
                if (args.phone_no != '' && args.phone_no != null && typeof args.phone_no != "undefined") {
                    const find_pn = await Detail_model.find({ delete: 0, phone_no: args.phone_no, role: args.role, _id: { $ne: args._id } });
                    if (find_pn.length > 0) {
                        return { info: { msg: "mobile no exists", status: 'failed' } }
                    }
                }

                if (args.email) {
                    const find_email = await Detail_model.find({ delete: 0, email: args.email, role: args.role, _id: { $ne: args._id } });
                    if (find_email.length > 0) {
                        return { info: { msg: "Email already exists", status: 'failed' } }
                    }
                }

                var user_deails = await Detail_model.findOne({ _id: args._id });
                var preview_data = user_deails.provider_subCategoryID;
                var check_category = false;
                if (Array.isArray(args.provider_subCategoryID)) {
                    for (let i = 0; i < args.provider_subCategoryID.length; i++) {
                        check_category = preview_data.includes(args.provider_subCategoryID[i]);
                        if (!check_category) {
                            args.proof_status = 0;
                            var msg = "please wait for admin confrimation in new category";
                            console.log('true')
                            // ================= push_notifiy ================== //
                            var message = {
                                to: user_deails.device_id,
                                collapse_key: 'your_collapse_key',
                                notification: {
                                    title: "Proof Status",
                                    body: msg,
                                    click_action: ".activities.HomeActivity",
                                },
                                data: {
                                    my_key: commonHelper.on_going,
                                    my_another_key: commonHelper.on_going
                                }
                            };
                            var msg_notification = await commonHelper.push_notifiy(message);
                            // ================= push_notifiy ================== //  
                            var send_verification = await commonHelper.send_mail_sendgrid(user_deails.email, "admin_approved", { msg });
                            await commonHelper.send_sms(user_deails.country_code, user_deails.phone_no, "admin_apporved", {})
                            await pubsub.publish(PROOF_STATUS, { proof_status: 0, _id: args._id });
                            break;
                        }
                    }
                }

                // args.last_otp_verification = moment.utc().valueOf();
                // args.last_email_otp_verification = moment.utc().valueOf();
                const update_user = await Detail_model.updateOne({ _id: args._id }, args);
                //console.log(update_user);
                if (update_user.n == update_user.nModified) {
                    var user_sms_data = await Detail_model.findOne({ _id: args._id });
                    if (data.phone_no && user_sms_data.phone_no !== data.phone_no) {
                        await commonHelper.send_sms(user_sms_data.country_code, user_sms_data.phone_no, "otp", { otp: user_sms_data.otp })
                    }
                    return { ...args, ...{ info: { "msg": "Update Process Success", status: 'success' } } };
                } else {
                    return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
                }
            } catch (error) {
                console.log("admin_update_user:admin_update_user -> error", error)
                return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
            }
        },

        addDetails: userResolver.addDetails,
        //  add sub category id in provider 
        addProvider_Category: categoryResolver.addProvider_Category,
        addCategory: categoryResolver.addCategory,
        addsubCategory: categoryResolver.addsubCategory,
        change_parent_bolck: categoryResolver.change_parent_bolck,
        add_providerDocument: statusResolver.add_providerDocument,
        delete_providerDocument: statusResolver.delete_providerDocument,
        pay_admin_to_provider: bookingResolver.pay_admin_to_provider,
        update_manual_payment: bookingResolver.update_manual_payment,
        //add new booking
        add_booking: async (parent, args, context, info) => {
            var img = [];
            if (args.file != '' && args.file != undefined) {
                for (let i = 0; i < args.file.length; i++) {
                    const { createReadStream, filename } = await args.file[i];
                    if (filename != undefined) {
                        var file_name = moment().unix() + "_" + filename;
                        await new Promise(res =>
                            createReadStream()
                                .pipe(createWriteStream(path.join(__dirname, "../images/booking", file_name)))
                                .on("close", res)
                        );
                        img.push(file_name);
                    }
                }
                delete args.file
            }
            args['user_image'] = img;
            var filter = {
                role: 2,
                online: 1,
                delete: 0,
                proof_status: 1,
                location: { $near: { $maxDistance: 10000, $geometry: { type: "Point", coordinates: [args.lng, args.lat] } } },
                provider_subCategoryID: { $in: [args.category_id] },
            };
            let find_provider = await Detail_model.find(filter);
            // console.log(args);
            //console.log(find_provider);
            var available_provider = []
            for (let i = 0; i < find_provider.length; i++) {
                available_provider.push(find_provider[i]._id);

                // ================= push_notifiy (to provider) ================== //
                var message = {
                    to: find_provider[i].device_id,
                    collapse_key: 'your_collapse_key',
                    notification: {
                        title: "YOUR JOB NOTIFICATION",
                        body: "notifiy",
                        click_action: ".activities.HomeActivity",
                    },
                    data: {
                        my_key: commonHelper.home,
                        my_another_key: commonHelper.home
                    }
                };
                var msg = await commonHelper.push_notifiy(message);
                // ================= push_notifiy ================== //
            }
            if (args.category_type == 1) {
                var category = await Category_model.findOne({ _id: args.category_id });
            } else if (args.category_type == 2) {
                var category = await subCategory_model.findOne({ _id: args.category_id });
            }

            if (args.booking_type == 1) {
                args['booking_date'] = moment.utc().format();
            } else if (args.booking_type == 2) {
                var a = moment.tz(args.booking_date + " " + args.booking_time, "Asia/Kolkata");
                args['booking_date'] = a.utc().format();
                args['booking_cron_date'] = a.utc().format("YYYY-MM-DD");
                args['booking_hour'] = a.utc().format("HH");
                args['booking_time'] = a.utc().format("HH:mm:ss");
            }
            args['available_provider'] = available_provider;
            args['location'] = { coordinates: [args.lng, args.lat] }
            args['service_fee'] = String(parseFloat(category.service_fee).toFixed(2));
            args['base_price'] = String(parseFloat(category.base_price).toFixed(2));
            args['hour_price'] = String(parseFloat(category.hour_price).toFixed(2));
            args['hour_limit'] = category.hour_limit;
            args['day_price'] = String(parseFloat(category.day_price).toFixed(2));
            args['day_limit'] = category.day_limit;
            args['price_type'] = category.price_type;

            args['booking_ref'] = String(Math.floor(1000 + Math.random() * 9000));
            args['ctob_shotcode'] = process.env.MPESA_SHORT_CODE;
            args['ctob_billRef'] = await genrate_random();
            args['job_status'] = 12;
            let add_booking = new Booking_model(args);
            let booking = await add_booking.save();
            // console.log(add_booking);
            // console.log("---------------");
            if (find_provider.length > 0) {
                var data = {
                    provider: find_provider,
                    category_id: args.category_id,
                    category_type: args.type,
                    user_id: args.user_id,
                    user_parent: true,
                    ...booking._doc,
                }
                // console.log('vis', data.booking_alert);
                var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: data });
            }

            await setTimeout(async () => {
                // console.log(booking._id);
                // console.log("its works");
                let booking_details = await Booking_model.findOne({ _id: booking._id });
                if (booking_details.booking_status == 12) {
                    var update_booking = await Booking_model.update({ _id: booking._id }, { booking_status: 15, job_status: 15, available_provider: [] }, { new: true });
                    var data = {
                        user_parent: true,
                        ...booking_details._doc
                    }
                    var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: data });
                }
            }, 120000);
            var new_data = await Booking_model.findOne({ _id: add_booking._id });
            return [{ id: add_booking._id, location: args.location, description: args.description, provider: find_provider, hours: args.hours, user_image_url: new_data.user_image_url }];
        },
        //change the status in job booking 
        manage_booking: async (parent, args) => {
            //console.log("m_b");
            //console.log(args);
            let booking_detail = await Booking_model.findOne({ _id: args.booking_id });

            // role 2 === provider && role 1 === User //
            if (args.role == 2) {
                if (args.booking_status == 9 && booking_detail.booking_status == 15) {
                    return [{ ...booking_detail._doc, ...{ msg: "sorry this job is closed", status: 'success' } }];
                }
                // 9 == provider accept
                if (args.booking_status == 9 && booking_detail.booking_status == 12) {
                    var update_booking = await Booking_model.update({ _id: args.booking_id }, { booking_status: 9, job_status: 9, available_provider: [], provider_id: args.provider_id }, { new: true });
                    if (update_booking.n == update_booking.nModified) {
                        var data = {
                            user_parent: true,
                            ...booking_detail._doc
                        }
                        var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: data });
                        let provider_detail = await Booking_model.findOne({ _id: args.booking_id });

                        provider_detail.user_parent = true;
                        provider_detail.status = "success";

                        // ================= push_notifiy (to user)================== //
                        // send to user 
                        let user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'Accept',
                                body: "JOB is accept a provider please confirm the job",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.home,
                                my_another_key: commonHelper.home,
                                booking_id: booking_detail._id
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //

                        var accept_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: provider_detail });
                        return [{ ...booking_detail._doc, ...{ msg: "Waiting for user confrimation", status: 'success' } }];
                    }

                } else if (args.booking_status == 8 && booking_detail.booking_status == 9) {
                    // console.log("oops ! provider cancel the booking !");
                    let data = {
                        msg: "oops ! provider cancel the booking !",
                        ...args
                    }
                    // console.log(data);
                    var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                    return [...booking_detail, ...{ msg: "", status: 'success' }];
                } else if (args.booking_status == 8 && booking_detail.booking_status == 10) {
                    // console.log("oops ! provider cancel the booking !");
                    let data = {
                        msg: "oops ! provider cancel the booking !",
                        ...args
                    }
                    var refund_data = {
                        charge: booking_detail.charge_id,
                    }

                    try {
                        // safaricom payemnt
                        var charge = {
                            status: "succeeded"
                        }
                        // var charge = await stripe.refunds.create(refund_data)
                    } catch (err) {
                        return [{ msg: "refund error", status: 'failed' }];
                    };

                    // console.log(charge);
                    if (charge.status == "succeeded") {
                        await Booking_model.update({ _id: args.booking_id }, { booking_status: 8, job_status: 8, payment_status: 6, manual_payment_status: true }, { new: true });
                        await Payout_model.remove({ booking_id: args.booking_id });
                        var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });

                        // ================= push_notifiy (to user)================== //
                        let user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'Provider Cancel Job',
                                body: "JOB Canceled the job",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.home,
                                my_another_key: commonHelper.home
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //

                        return [{ job_status: 8, msg: "cancel successfull", status: 'success' }];
                    } else {
                        await Booking_model.update({ _id: args.booking_id }, { booking_status: 10, payment_status: 3 }, { new: true });
                        return [{ msg: "cancel failed", status: 'failed' }];
                    }

                } else if (booking_detail.booking_status == 9) {
                    //console.log("oops ! your are late ? already booked !");
                    let data = {
                        msg: "oops ! your are late ? already booked !",
                        status: 'failed',
                        ...args,
                        msg_status: 'to_provider'
                    }
                    // console.log(data);
                    var provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });

                    return [data];
                } else if (booking_detail.booking_status == 11) {
                    //console.log("oops !  user cancel for the booking !");
                    let data = {
                        msg: "oops ! user cancel for the booking !",
                        status: 'success',
                        ...args,
                        msg_status: 'to_provider'
                    }
                    var provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });

                    return [data];

                } else if (args.booking_status == 16) {
                    var end_data = {};
                    if (args.extra_fare) {
                        var s_extra_fare = args.extra_fare.replace("KSh", "");
                        if (!Number(s_extra_fare)) {
                            s_extra_fare = 0
                        }
                    }
                    args.extra_fare = String(parseFloat(Number(s_extra_fare)).toFixed(2))
                    if (args.option == 1) {
                        //add extra_fee
                        let provider_fee = Number(booking_detail.provider_fee) + Number(args.extra_fare);    // add extra_fare in provider fee
                        let total = Number(booking_detail.total) + Number(args.extra_fare);                  // add extra_fare in total amount
                        let extra_price = Number(booking_detail.extra_price) + Number(args.extra_fare);    // add extra_fare in extra price
                        let final_payment = Number(booking_detail.final_payment) + Number(args.extra_fare);
                        let data = {
                            booking_id: args.booking_id,
                            extra_fare: String(parseFloat(args.extra_fare).toFixed(2)),
                            extra_fare_reason: args.extra_fare_reason,
                        }
                        let add_extra_fee = new Extra_fee_model(data);
                        let extra_fee = await add_extra_fee.save();
                        end_data = {
                            provider_fee: String(parseFloat(provider_fee).toFixed(2)),
                            total: String(parseFloat(total).toFixed(2)),
                            extra_price: String(parseFloat(extra_price).toFixed(2)),
                            final_payment: String(parseFloat(final_payment).toFixed(2)),
                            payment_status: 4
                        };
                        var end_result = await Booking_model.update({ _id: args.booking_id }, end_data, { new: true });
                        if (end_result.n == end_result.nModified) {
                            await Payout_model.update({ booking_id: args.booking_id }, {
                                amount: String(parseFloat(Number(end_data.provider_fee)).toFixed(2))
                            });
                            var result_data = await Booking_model.findOne({ _id: args.booking_id });
                            // console.log([{{ msg: "Extra fare added success", status: 'success' }}]);
                            extra_fee.msg = "Extra fee add success";
                            extra_fee.status = 'success';
                            return [extra_fee];
                        } else {
                            //  console.log([{ msg: "Extra fare added success", status: 'failed' }]);
                            return [{ msg: "Extra added failed", status: 'failed' }];
                        }
                    }
                    if (args.option == 2) {
                        //update extra_fee
                        var find_extra_data = await Extra_fee_model.findOne({ _id: args.extra_fare_id }).lean();
                        console.log("find_extra_data", find_extra_data)
                        let provider_fee = Number(booking_detail.provider_fee) - Number(find_extra_data.extra_fare);         // sub extra_fare in provider fee
                        let total = Number(booking_detail.total) - Number(find_extra_data.extra_fare);                       // sub extra_fare in total amount
                        let extra_price = Number(booking_detail.extra_price) - Number(find_extra_data.extra_fare);           // sub extra_fare in extra price
                        let final_payment = Number(booking_detail.final_payment) - Number(find_extra_data.extra_fare);
                        end_data = {
                            provider_fee: String(parseFloat(Number(provider_fee) + Number(args.extra_fare)).toFixed(2)),      //add update extra fare in pro_fee
                            total: String(parseFloat(Number(total) + Number(args.extra_fare)).toFixed(2)),
                            extra_price: String(parseFloat(Number(extra_price) + Number(args.extra_fare)).toFixed(2)),
                            final_payment: String(parseFloat(Number(final_payment) + Number(args.extra_fare)).toFixed(2))
                        };
                        console.log("end_data", end_data)
                        var extra_fare_update = { extra_fare: String(parseFloat(args.extra_fare).toFixed(2)), extra_fare_reason: args.extra_fare_reason };
                        var update_extra_fee = await Extra_fee_model.update({ _id: args.extra_fare_id }, extra_fare_update, { new: true });
                        if (update_extra_fee.n == update_extra_fee.nModified) {
                            var end_result = await Booking_model.update({ _id: args.booking_id }, end_data, { new: true });
                            if (end_result.n == end_result.nModified) {
                                await Payout_model.update({ booking_id: args.booking_id }, {
                                    amount: String(parseFloat(Number(end_data.provider_fee)).toFixed(2))
                                });
                                var result_data = await Booking_model.findOne({ _id: args.booking_id });
                                extra_fare_update.msg = "Extra fee Update success";
                                extra_fare_update.status = 'success';
                                return [extra_fare_update];
                            } else {
                                return [{ msg: "Extra fee Update failed", status: 'failed' }];
                            }
                        } else {
                            return [{ msg: "Extra fee Update failed", status: 'failed' }];
                        }
                    }
                    if (args.option == 3) {
                        
                        var find_extra = await Extra_fee_model.find({ booking_id: args.booking_id });
                        var find_extra_data = await Extra_fee_model.findOne({ _id: args.extra_fare_id }).lean();
                        if (find_extra.length == 0) {
                            return [{ msg: "Extra feee Id Wrong", status: "failed" }]
                        }
                        let provider_fee = Number(booking_detail.provider_fee) - Number(find_extra_data.extra_fare);     // sub extra_fare in provider fee
                        let total = Number(booking_detail.total) - Number(find_extra_data.extra_fare);                  // sub extra_fare in total amount
                        let extra_price = Number(booking_detail.extra_price) - Number(find_extra_data.extra_fare);       // sub extra_fare in extra price
                        let final_payment = Number(booking_detail.final_payment) - Number(find_extra_data.extra_fare);
                        end_data = {
                            provider_fee: String(parseFloat(provider_fee).toFixed(2)),
                            total: String(parseFloat(total).toFixed(2)),
                            extra_price: String(parseFloat(extra_price).toFixed(2)),
                            final_payment: String(parseFloat(final_payment).toFixed(2))
                        };
                        if (find_extra.length == 1) {
                            // console.log("jhweg");
                            end_data.payment_status = 0;
                        }
                        var delete_extra_fee = await Extra_fee_model.remove({ _id: args.extra_fare_id });
                        var end_result = await Booking_model.update({ _id: args.booking_id }, end_data, { new: true });
                        //console.log(end_result);
                        if (end_result.n == end_result.nModified) {
                            await Payout_model.update({ booking_id: args.booking_id }, {
                                amount: String(parseFloat(Number(end_data.provider_fee)).toFixed(2))
                            });
                            var result_data = await Booking_model.findOne({ _id: args.booking_id });
                            result_data.msg = "Extra removed success";
                            result_data.status = 'success';
                            return [result_data];
                        } else {
                            return [{ msg: "Extra removed failed", status: 'failed' }];
                        }
                    }
                } else if (args.booking_status == 13) {
                    var end_data = {}
                    let sms_notification = "job_finished"
                    // provider end the job (13)
                    end_data = { job_status: 13, booking_status: 13, jobEnd_time: moment.utc().format() };
                    var end_result = await Booking_model.update({ _id: args.booking_id }, end_data, { new: true });
                    var job_result = await Booking_model.findOne({ _id: args.booking_id });
                    if (end_result.n == end_result.nModified) {
                        var start = moment(job_result.jobStart_time);                                       //start date
                        var end = moment(job_result.jobEnd_time);                                           // end date
                        var duration = moment.duration(end.diff(start));
                        var process_hours = parseInt(duration.asHours());
                        var job_minutes = parseInt(duration.asMinutes()) - process_hours * 60;      //extra minutes
                        var hour = Number(process_hours) - Number(job_result.hour_limit);           //extra hours
                        var total = Number(job_result.total);
                        var final_payment = Number(final_payment);
                        var provider_fee = Number(job_result.provider_fee);
                        var extra_hour_price = Number(job_result.extra_hour_price);
                        if (job_result.price_type === "day") {
                            // day vice job
                            var process_days = parseInt(duration.asDays());
                            if (process_days > 0) {
                                var days = (Number(process_days) + 1) - Number(job_result.day_limit);           //extra day
                                let day_amount = Number(days) * Number(job_result.day_price);                  // extra day *  hour fee
                                provider_fee += Number(day_amount);                                         // update provider fee (add hour fee in provider amount)
                                total += Number(day_amount);
                                final_payment += Number(day_amount);                                        // update total fee (add hour fee in total amount)
                                extra_hour_price += Number(day_amount);
                            }
                        } else if (job_result.price_type === "hour") {
                            if (hour > 0) {
                                // console.log("hujbs");
                                let hour_amount = Number(hour) * Number(job_result.hour_price);                  // extra hour *  hour fee
                                provider_fee += Number(hour_amount);                                         // update provider fee (add hour fee in provider amount)
                                total += Number(hour_amount);
                                final_payment += Number(hour_amount);                                        // update total fee (add hour fee in total amount)
                                extra_hour_price += Number(hour_amount);
                            }
                            if (job_minutes > 0) {
                                // console.log("sknkj");
                                let one_minutes_fee = Number(job_result.job_hour_price) / 60;                   //calculate 1 minutes base fee
                                let minutes_amount = job_minutes * one_minutes_fee;                                 // extra minutes *  1 minutes fee
                                provider_fee += Number(minutes_amount);                          // update provider fee (add minutes fee in provider amount)
                                total += Number(minutes_amount);                                 // update total fee (add minutes fee in total amount)
                                final_payment += Number(minutes_amount);                                // update final_payment fee (add hour fee in total amount)
                                extra_hour_price += Number(minutes_amount);
                            }
                        }
                        // console.log(job_result.total);
                        if (Number(total) > (job_result.total)) {
                            sms_notification = "pay_extra_fare"
                            await Booking_model.update({ _id: args.booking_id }, {
                                provider_fee: String(parseFloat(provider_fee).toFixed(2)),
                                total: String(parseFloat(total).toFixed(2)),
                                extra_hour_price: String(parseFloat(Number(extra_hour_price)).toFixed(2)),
                                payment_status: 4
                            }, { new: true });
                            await Payout_model.update({ booking_id: args.booking_id }, {
                                amount: String(parseFloat(Number(provider_fee)).toFixed(2)),
                                booking_status: 13
                            });
                        }
                        var final_result = await Booking_model.findOne({ _id: args.booking_id });
                        // ================= push_notifiy (to user)================== //

                        let user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
                        let pro_user_detail = await Detail_model.findOne({ _id: booking_detail.provider_id });
                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'Provider End the Job',
                                body: "JOB is end for provider",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.on_going,
                                my_another_key: commonHelper.on_going,
                                booking_id: args.booking_id
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //
                        final_result.msg = "job is end";
                        final_result.status = "success";
                        // console.log(final_result);
                        await commonHelper.send_sms(user_detail.country_code, user_detail.phone_no, "sms_notification", {})
                        await commonHelper.send_sms(pro_user_detail.country_code, pro_user_detail.phone_no, "job_finished", {})

                        var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: final_result });
                        return [final_result];
                    } else {
                        return [{ msg: "job is ended failed", status: 'failed' }];
                    }
                } else if (args.booking_status == 4) {
                    var result = await Booking_model.update({ _id: args.booking_id }, { job_status: 4, booking_status: 4, jobStart_time: moment.utc().format() }, { new: true });
                    var job_result = await Booking_model.findOne({ _id: args.booking_id });
                    if (result.n == result.nModified) {
                        job_result.msg = "job is start";
                        job_result.status = "success";
                        // ================= push_notifiy (to user) ================== //
                        let user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'Provider Start the Job',
                                body: "JOB is start for provider",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.on_going,
                                my_another_key: commonHelper.on_going,
                                booking_id: args.booking_id
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //
                        var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: job_result });
                        return [job_result];
                    } else {
                        return [{ msg: "job start failed", status: 'failed' }];
                    }

                }
            } else if (args.role == 1) {
                // user_cancel 
                if (args.booking_status == 11 && booking_detail.booking_status == 12) {
                    var update_booking = await Booking_model.update({ _id: args.booking_id }, { job_status: 11, booking_status: 11, available_provider: [] }, { new: true });
                    if (update_booking.n == update_booking.nModified) {
                        var data = {
                            user_parent: true,
                            msg: "Booking Cancel Success",
                            status: 'success',
                            ...booking_detail._doc
                        }
                        var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: data });
                        return [{ msg: "Booking Cancel Success", status: 'success' }];
                    } else {
                        return [{ msg: "Booking Cancel Failed", status: 'failed' }];
                    }
                } else if (args.booking_status == 10 && booking_detail.booking_status == 9) {
                    var data = {};
                    // console.log("========================");
                    // console.log("TRNSCATIONS START");
                    // console.log(args);
                    let base_amount = booking_detail.base_price;
                    let service_fee = booking_detail.service_fee;
                    let admin_fee = (service_fee / 100) * base_amount;              // store admin fee  ....
                    let provider_fee = Number(base_amount) - Number(admin_fee);     //store provider fee ...
                    let amount = Number(base_amount)                                // total fee eg : (100)
                    args['admin_fee'] = admin_fee;
                    args['provider_fee'] = provider_fee
                    args['total'] = amount;
                    // console.log("osp")
                    try {
                        if (args['payment_type'] && args['payment_type'] === "c2b") {
                            var update_booking_c2b = await Booking_model.update({ _id: args.booking_id }, {
                                accept_date: moment.utc().format(),
                                admin_fee: String(parseFloat(args.admin_fee).toFixed(2)),
                                provider_fee: String(parseFloat(args.provider_fee).toFixed(2)),
                                total: String(parseFloat(args.total).toFixed(2)),
                                booking_status: 50, // 50 means waiting booking
                                phone_number: args.phone_number || "",
                                payment_type: "c2b",
                            }, { new: true });
                            var findBooking = await Booking_model.find({ _id: args.booking_id });
                            data = {
                                user_parent: true,
                                ...findBooking,
                                msg: "user accept the job ",
                                status: 'success',
                                msg_status: 'to_provider'
                            }
                            // console.log("data", data)
                            return [data]
                        } else {

                            var charge = await safaricom.safaricom_lipesa_simulate(args.phone_number, String(amount),booking_detail.booking_ref)
                            // console.log("charge", charge)
                            if (charge.status == true && charge.data.ResponseCode === '0') {
                                // update charge amount
                                // console.log(charge.data.MerchantRequestID, args.booking_id)
                                var update_booking = await Booking_model.update({ _id: args.booking_id }, {
                                    accept_date: moment.utc().format(),
                                    admin_fee: String(parseFloat(args.admin_fee).toFixed(2)),
                                    provider_fee: String(parseFloat(args.provider_fee).toFixed(2)),
                                    total: String(parseFloat(args.total).toFixed(2)),
                                    booking_status: 50, // 50 means waiting booking
                                    phone_number: args.phone_number,
                                    payment_type: "lipesa",
                                    // job_status: 10,
                                    // payment_status: 1,
                                    MerchantRequestID: charge.data.MerchantRequestID || 0,
                                    CheckoutRequestID: charge.data.CheckoutRequestID || 0
                                }, { new: true });
                                var findBooking = await Booking_model.find({ _id: args.booking_id });
                                data = {
                                    user_parent: true,
                                    ...findBooking,
                                    msg: "user accept the job ",
                                    status: 'success',
                                    msg_status: 'to_provider'
                                }
                                // console.log("data", data)
                                return [data]
                            } else {
                                return [{ msg: "Payment charge failed", status: 'failed' }]
                            }
                        }

                    } catch (err) {
                        // console.log("err", err)
                        return [{ msg: "Booking Payment failed", status: 'failed' }]
                    }



                } else if (args.booking_status == 11 && booking_detail.booking_status == 9) {
                    var update_booking = await Booking_model.update({ _id: args.booking_id }, { booking_status: 11, job_status: 11 }, { new: true });
                    var data = {
                        user_parent: true,
                        ...booking_detail._doc,
                        msg: "Sorry ! user cancel the job ",
                        msg_status: 'to_provider'
                    }
                    var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                    return [{ msg: "Booking Cancel Success", status: 'success' }];

                } else if (args.booking_status == 11 && booking_detail.booking_status == 10) {
                    // console.log("oops ! user canceled the Job");
                    var updatedata = {};
                    var refund_data = {};
                    var amount = 0;
                    // console.log("========================")
                    // console.log("CANCEL TRNSCATIONS");
                    if (booking_detail.job_status == 4) {
                        amount = Number(booking_detail.total) - Number(admin_fee)
                        refund_data = {
                            charge: booking_detail.charge_id,
                            amount: amount
                        }
                    } else if (booking_detail.job_status == 10) {
                        refund_data = {
                            charge: booking_detail.charge_id,
                        }
                    } else {

                    }
                    // const charge = await stripe.refunds.create(refund_data);
                    var charge = {
                        status: "succeeded",
                        refunded: true
                    }
                    if (charge.status == "succeeded" && charge.refunded == true) {
                        await Booking_model.update({ _id: args.booking_id }, { booking_status: 11, job_status: 11, payment_status: 6, manual_payment_status: true }, { new: true });
                        await Payout_model.remove({ booking_id: args.booking_id });
                        var data = {
                            user_parent: true,
                            ...booking_detail._doc,
                            msg: "Sorry ! user cancel the job ",
                            msg_status: 'to_provider'
                        }
                        // ================= push_notifiy (to provider)================== //
                        let user_detail = await Detail_model.findOne({ _id: booking_detail.provider_id });
                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'User Cancel the Job',
                                body: "User Cancel the job",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.home,
                                my_another_key: commonHelper.home
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //
                        var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                        return [{ msg: "refund sucess", status: 'success' }];
                    } else {
                        return [{ msg: "refund failed", status: 'failed' }];
                    }

                } else if (args.booking_status == 14) {
                    var final_job = await Booking_model.findOne({ _id: args.booking_id });
                    // console.log(final_job);
                    // console.log(Number(final_job.final_payment));
                    // console.log(parseFloat(Number(final_job.final_payment) * 100).toFixed(0));
                    if (final_job.payment_status == 4) {
                        var res = []
                        let admin_fee = (final_job.service_fee / 100) * final_job.final_payment;              // store admin fee  ....
                        let provider_fee = Number(final_job.provider_fee) - Number(admin_fee);     //store provider fee ...
                        args['admin_fee'] = Number(final_job.admin_fee) + Number(admin_fee);
                        args['provider_fee'] = provider_fee;

                        try {
                            let final_amount = Number(final_job.final_payment)

                            if (args['payment_type'] && args['payment_type'] === "c2b") {
                                var update_booking = await Booking_model.update({ _id: args.booking_id }, {
                                    end_date: moment.utc().format(),
                                    admin_fee: String(parseFloat(args.admin_fee).toFixed(2)),
                                    provider_fee: String(parseFloat(args.provider_fee).toFixed(2)),
                                    phone_number: args.phone_number,
                                    payment_type: "c2b",
                                    mpeas_payment_callback: true,
                                    // job_status: 10,
                                    // payment_status: 1,
                                }, { new: true });
                                var findBooking = await Booking_model.find({ _id: args.booking_id });
                                return [{ job_status: 14, msg: "job is completed successfully", status: 'success' }];
                            } else {
                                var charge = await safaricom.safaricom_lipesa_simulate(args.phone_number, String(final_amount),booking_detail.booking_ref)

                                if (charge.status == true && charge.data.ResponseCode === '0') {
                                    // update charge amount
                                    var update_booking = await Booking_model.update({ _id: args.booking_id }, {
                                        end_date: moment.utc().format(),
                                        admin_fee: String(parseFloat(args.admin_fee).toFixed(2)),
                                        provider_fee: String(parseFloat(args.provider_fee).toFixed(2)),
                                        phone_number: args.phone_number,
                                        payment_type: "lipesa",
                                        mpeas_payment_callback: true,
                                        // job_status: 10,
                                        // payment_status: 1,
                                        MerchantRequestID: charge.data.MerchantRequestID || 0,
                                        CheckoutRequestID: charge.data.CheckoutRequestID || 0
                                    }, { new: true });
                                    var findBooking = await Booking_model.find({ _id: args.booking_id });
                                    return [{ job_status: 14, msg: "job is completed successfully", status: 'success' }];

                                } else {
                                    return [{ job_status: 14, msg: "job is completed failed", status: 'failed' }];

                                }
                            }

                        } catch (err) {
                            return [{ job_status: 14, msg: "job is completed failed", status: 'failed' }];
                        }


                        // }).catch(err => {
                        //     // console.log("Error:", err);
                        // });
                        return res;
                    } else {
                        await Booking_model.update({ _id: args.booking_id }, { payment_status: 5, booking_status: 14, job_status: 14 }, { new: true });
                        await Payout_model.update({ booking_id: args.booking_id }, { booking_status: 14 }, { new: true });
                        // ================= push_notifiy (to provider) ================== //
                        let user_detail = await Detail_model.findOne({ _id: booking_detail.provider_id });
                        let app_user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });

                        var message = {
                            to: user_detail.device_id,
                            notification: {
                                title: 'User Complete the Job',
                                body: "User Complete the job",
                                click_action: ".activities.HomeActivity",
                            },
                            data: {
                                my_key: commonHelper.completed,
                                my_another_key: commonHelper.completed,
                                booking_id: args.booking_id
                            }
                        };
                        var msg = await commonHelper.push_notifiy(message);
                        // ================= push_notifiy ================== //
                        await commonHelper.send_sms(app_user_detail.country_code, app_user_detail.phone_no, "job_finished", {})
                        return [{ job_status: 14, msg: "job is completed successfully", status: 'success' }];
                    }

                }
            }
        },

        update_booking: async (parent, args) => {
            var img = []
            var data = {};
            if (args.file != undefined && args.file.length > 0) {
                for (let i = 0; i < args.file.length; i++) {
                    const { createReadStream, filename } = await args.file[i];
                    if (filename != undefined) {
                        var file_name = moment().unix() + "_" + filename;
                        await new Promise(res =>
                            createReadStream().pipe(createWriteStream(path.join(__dirname, "../images/booking", file_name))).on("close", res)
                        );
                        img.push(file_name);
                    }
                }
                delete args.file
            }
            var preview_data = await Booking_model.findOne({ _id: args.booking_id });
            var img_data = [];
            if (args.option == 1) {
                img_data = [...img, ...preview_data.start_job_image];
                data = await Booking_model.update({ _id: args.booking_id }, { start_job_image: img_data }, { new: true });
            } else if (args.option == 2) {
                img_data = [...img, ...preview_data.end_job_image];
                data = await Booking_model.update({ _id: args.booking_id }, { end_job_image: img_data }, { new: true });
            }
            var booking = await Booking_model.findOne({ _id: args.booking_id });
            if (data.n == data.nModified) {
                booking.msg = "file upload success";
                booking.status = "success";
                var send_provider = await pubsub.publish(SEND_JOB_MSG, { send_jobs_provider: booking });
                return booking;
            } else {
                booking.msg = "file upload failed";
                booking.status = "failed";
                return booking;
            }
        },
        updateCategory: categoryResolver.updateCategory,
        updatesubCategory: categoryResolver.updatesubCategory,
        update_profile: userResolver.update_profile,
        updateAvailability: userResolver.updateAvailability,
        removeAvailability: userResolver.removeAvailability,

        // ------------------------delete function --------------------------------//
        deleteDetails: userResolver.deleteUser,
        deleteCategory: categoryResolver.deleteCategory,
        deletesubCategory: categoryResolver.deletesubCategory,
        deleteStatic: staticResolver.delete_static,
        deleteCertificate: certificateResolver.delete_certificate,
        deleteProvider_Category: categoryResolver.deleteProvider_Category,
        deleteBooking: bookingResolver.deleteBooking,
        // ------------------------delete function --------------------------------//

        add_certificate: certificateResolver.add_certificate,
        update_certificate: certificateResolver.update_certificate,
        add_static: staticResolver.add_static,
        update_static: staticResolver.update_static,

        online_status: statusResolver.online_status,
        available_deleteBooking: bookingResolver.available_deleteBooking,
        addRating: bookingResolver.addRating,
        update_booking_details: bookingResolver.update_booking_details,
        add_site_detail: settingResolver.add_site_detail,
        add_payout_detail: settingResolver.add_payout_detail,
        update_site_img: settingResolver.update_site_img,
        modified_address: userResolver.modified_address,
        update_msg_is_read: statusResolver.update_msg_is_read,
        add_message: async (parent, args, context, info) => {  //chat function
            // console.log(args);
            var msg_count_data = {};
            args.message_date = moment.utc().format();
            const add_msg = new message_model(args);
            var data = await add_msg.save();
            var booking = await Booking_model.findOne({ _id: args.booking_id });
            if (args.role == 1) {
                msg_count_data['provider_msg_count'] = Number(booking.provider_msg_count) + 1;
                msg_count_data['provider_msg_is_read'] = 1;
            } else if (args.role == 2) {
                msg_count_data['user_msg_count'] = Number(booking.user_msg_count) + 1;
                msg_count_data['user_msg_is_read'] = 1;
            }

            var msg_count = await Booking_model.findOneAndUpdate({ _id: args.booking_id }, msg_count_data, { new: true });
            var datas = await message_model.findOne({ _id: data._id });
            await pubsub.publish(MESSAGE_CREATED, { messageSent: datas });
            var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: msg_count });
            // ================= push_notifiy ================== //
            var user_data = {};
            if (args.role == 1) {
                user_data = { _id: booking.provider_id }
            } else if (args.role == 2) {
                user_data = { _id: booking.user_id }
            }
            var user = await Detail_model.findOne(user_data);
            msg_count_data['booking_id'] = args.booking_id;
            var message = {
                to: user.device_id,
                collapse_key: 'your_collapse_key',
                notification: {
                    title: "Message",
                    body: msg_count_data,
                    click_action: ".activities.HomeActivity",
                },
                data: {
                    my_key: commonHelper.chat,
                    my_another_key: commonHelper.chat,
                    booking_id: args.booking_id
                }
            };
            var msg_notification = await commonHelper.push_notifiy(message);
            // ================= push_notifiy ================== //  
            return datas;
        },
        provider_document_verified: async (parent, args) => {
            var document_verified = await Detail_model.updateOne({ _id: args._id }, { proof_status: args.proof_status });
            if (document_verified.n == document_verified.nModified) {
                var user = await Detail_model.findOne({ _id: args._id });
                var msg = "";
                if (args.proof_status == 0)
                    msg = "you have been un approved as Gigzzy pro"
                else
                    msg = "Congratulations,you have been approved as Gigzzy pro"
                // ================= push_notifiy ================== //
                var message = {
                    to: user.device_id,
                    collapse_key: 'your_collapse_key',
                    notification: {
                        title: "Proof Status",
                        body: msg,
                        click_action: ".activities.HomeActivity",
                    },
                    data: {
                        my_key: commonHelper.on_going,
                        my_another_key: commonHelper.on_going
                    }
                };
                var msg_notification = await commonHelper.push_notifiy(message);
                // ================= push_notifiy ================== //  
                var send_verification = await commonHelper.send_mail_sendgrid(user.email, "admin_approved", { msg });
                var send_sms_verification = await commonHelper.send_sms(user.country_code, user.phone_no, "admin_apporved", {})
                await pubsub.publish(PROOF_STATUS, { proof_status: user });
                return { info: { "msg": "Status Update Success", status: 'success' } };
            } else {
                return { info: { "msg": "Status Update Failed !", status: 'failed' } };
            }
        },
    }


};
/* 
    @params() // 2==later,10==user_accept
*/
const remove_demo_acount = new CronJob('* * * * * *', async () => {
    let data = { "demo_end_time": { '$lt': moment.utc().format() }, demo: true, delete: 0 };
    var result = await Detail_model.find(data);
    if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            var data_result = { _id: result[i]._id, msg: "demo account ended", status: 'success' };
            var remove_user = await Detail_model.updateOne({ _id: result[i]._id }, { delete: 1 }, { new: true });
            await pubsub.publish(REMOVE_USER, { demo_account: data_result });
        }
    }
});

module.exports.confrimation_call = async (body) => {
    return new Promise(async function (resolve, reject) {
        try {
            // console.log("module.exports.confrimation_call -> body", body)
            let CheckoutRequestID = body["Body"]["stkCallback"]["CheckoutRequestID"]
            let ResultCode = body["Body"]["stkCallback"]["ResultCode"]
            let update_details = {
                payment_message: ""
            }
            update_details['resultcode'] = ResultCode;
            update_details['payment_message'] = body["Body"]["stkCallback"]["ResultDesc"]

            let pre_booking_detail = await Booking_model.findOne({ CheckoutRequestID }).lean()
            if (ResultCode != 0) {

                if (pre_booking_detail.booking_status === 13) {
                    update_details['mpeas_payment_callback'] = true;
                    let update_booking_detail = await Booking_model.updateOne({ CheckoutRequestID }, update_details)
                } else {
                    update_details['job_status'] = 11;
                    update_details['booking_status'] = 11;
                    let update_booking_detail = await Booking_model.updateOne({ CheckoutRequestID }, update_details)
                }
                const error_result = await Booking_model.find({ provider_id: pre_booking_detail.provider_id }).sort({ created_at: -1 });
                let error_booking_detail = await Booking_model.findOne({ CheckoutRequestID }).lean()
                let data = {
                    user_parent: true,
                    ...error_booking_detail,
                    msg: update_details['payment_message'],
                    status: 'failed',
                    msg_status: 'to_provider'
                }
                await pubsub.publish(APPOINTMENTS, { get_my_appointments: error_result });
                await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                // to user
                let error_invoice_user_data = {
                    user_parent: true,
                    ...error_booking_detail,
                    msg: update_details['payment_message'],
                    status: 'failed',
                    msg_status: 'to_user'
                }
                let error_payment_issues = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: error_invoice_user_data });
                console.log(error_payment_issues, "module.exports.confrimation_call -> error_payment_issues")
                return resolve({ status: true, msg: "Mpesa Payment failed !" })
            }

            if (pre_booking_detail.booking_status === 13) {
                update_details['mpeas_payment_callback'] = false;
                update_details['payment_status'] = 5;
                update_details['booking_status'] = 14;
                update_details['job_status'] = 14;
                update_details['MpesaReceiptNumber'] = body["Body"]["stkCallback"]["CallbackMetadata"]["Item"][1]["Value"];
                update_details['TransactionDate'] = body["Body"]["stkCallback"]["CallbackMetadata"]["Item"][3]["Value"];
            } else {
                update_details['job_status'] = 10;
                update_details['booking_status'] = 10;
                update_details['MpesaReceiptNumber'] = body["Body"]["stkCallback"]["CallbackMetadata"]["Item"][1]["Value"];
                update_details['TransactionDate'] = body["Body"]["stkCallback"]["CallbackMetadata"]["Item"][3]["Value"];
            }


            let booking_detail = await Booking_model.findOne({ CheckoutRequestID })
            let update_booking_detail = await Booking_model.updateOne({ CheckoutRequestID: CheckoutRequestID }, update_details)

            if (pre_booking_detail.booking_status === 16) {
                var pay_detail = await Payout_model.update({ booking_id: booking_detail.booking_id }, { booking_status: 14 });
            } else {
                let update_provider_data = {
                    provider_id: booking_detail.provider_id,
                    booking_id: booking_detail._id,
                    amount: String(booking_detail.provider_fee),
                    booking_status: 10
                };
                const update_provider = new Payout_model(update_provider_data);
                const save = await update_provider.save();
            }

            // ================= push_notifiy (to provider) ================== //
            let user_detail = await Detail_model.findOne({ _id: booking_detail.provider_id });
            let app_user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
            if (user_detail && user_detail.device_id) {
                var notification = {}

                if (pre_booking_detail.booking_status === 13) {
                    notification = {
                        title: 'Complete',
                        body: "User Complete the job",
                        click_action: ".activities.HomeActivity",
                    }
                } else {
                    notification = {
                        title: 'Accept',
                        body: "User Accept The Job",
                        click_action: ".activities.HomeActivity",
                    }
                }
            }
            var message = {
                to: user_detail.device_id,
                notification: notification,
                data: {
                    my_key: commonHelper.pending,
                    my_another_key: commonHelper.pending,
                    booking_id: booking_detail.booking_id
                }
            };
            var msg = await commonHelper.push_notifiy(message);
            // ================= push_notifiy ================== //
            // return response 
            if (pre_booking_detail.booking_status === 13) {
                await commonHelper.send_sms(app_user_detail.country_code, app_user_detail.phone_no, "job_finished", {})
                return resolve({ job_status: 14, msg: "job is completed successfully", status: 'success' });

            } else {
                let data = {
                    user_parent: true,
                    ...booking_detail.data._doc,
                    msg: "user accept the job ",
                    status: 'success',
                    msg_status: 'to_provider'
                }
                const result = await Booking_model.find({ provider_id: booking_detail.provider_id, booking_status: 10 }).sort({ created_at: -1 });
                await commonHelper.send_sms(user_detail.country_code, user_detail.phone_no, "job_assign", {})
                await commonHelper.send_sms(app_user_detail.country_code, app_user_detail.phone_no, "job_placed", {})
                var appointments_details = await pubsub.publish(APPOINTMENTS, { get_my_appointments: result });
                var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                //to user
                console.log("provider")

                let invoice_user_data = {
                    user_parent: true,
                    ...booking_detail.data._doc,
                    msg: "user accept the job ",
                    status: 'success',
                    msg_status: 'to_user'
                }
                await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: invoice_user_data });
                console.log("module.exports.confrimation_call -> cancel_provider_to_user", cancel_provider_to_user)
                return resolve({ status: true, msg: "Payment Is success !", data })
            }

        } catch (error) {
            console.log("module.exports.confrimation_call -> error", error)
            return reject({ status: false, msg: "Payment Is Failed" })
        }
    })
}



module.exports.c2b_validation = async (body) => {
    return new Promise(async function (resolve, reject) {
        try {
            let ctob_billRef = body["BillRefNumber"]
            let shotcode = body["BusinessShortCode"]
            let MPESA_shotcode = process.env.MPESA_SHORT_CODE
            console.log("module.exports.c2b_validation -> MPESA_shotcode", MPESA_shotcode)
            var pre_booking_detail = await Booking_model.findOne({ ctob_billRef }).lean()
            if (shotcode != MPESA_shotcode) {
                console.log("module.exports.c2b_validation -> shotcode", shotcode)
                return reject({ status: false, msg: "Your payment shotcode is invalid !" })
            }
            if (!_.size(pre_booking_detail)) {
                console.log("module.exports.c2b_validation -> pre_booking_detail", "pre_booking_detail")
                return reject({ status: false, msg: "Your bill Reference is invalid !" })
            }
            if (pre_booking_detail.booking_status === 13) {
                if (pre_booking_detail['extra_price'] != Number(body['TransAmount'])) {
                    console.log("module.exports.c2b_validation -> pre_booking_detail", pre_booking_detail['extra_price'])

                    return reject({ status: false, msg: "Your payment amount is invalid !" })
                }
            } else {
                if (pre_booking_detail['base_price'] != Number(body['TransAmount'])) {
                    console.log("module.exports.pre_booking_detail -> error", body['TransAmount'], pre_booking_detail['base_price'])
                    return reject({ status: false, msg: "Your payment amount is invalid !", pre_booking_detail })
                }
            }
            return resolve({ status: true, msg: "Your payment amount is valid !" })
        } catch (error) {
            console.log("module.exports.confrimation_call -> error", error)
            return reject({ status: false, msg: "Payment Is Failed" })
        }
    })
}
/**
 * 
 * @param {*} body 
 * @returns 
 */
module.exports.c2b_confirmation = async (body) => {
    return new Promise(async function (resolve, reject) {
        try {
            // console.log("module.exports.confrimation_call -> body", body)
            let ctob_billRef = body["BillRefNumber"]
            let ResultCode = 0
            let update_details = {
                payment_message: ""
            }
            update_details['resultcode'] = ResultCode;
            update_details['payment_message'] = "ctob payment sucess"

            let pre_booking_detail = await Booking_model.findOne({ ctob_billRef }).lean()
            if (!_.size(pre_booking_detail)) {
                console.log("module.exports.pre_booking_detail -> error", "null")
                return reject({ status: false, msg: "Payment bill refe is in-correct" })
            }
            /**
             * check booking amount
             */
            if (pre_booking_detail.booking_status === 13) {
                if (pre_booking_detail['extra_price'] != Number(body['TransAmount'])) {
                    ResultCode = 1
                }
            } else {
                if (pre_booking_detail['base_price'] != Number(body['TransAmount'])) {
                    console.log("module.exports.pre_booking_detail -> error", body['TransAmount'], pre_booking_detail['base_price'])
                    ResultCode = 2
                }
            }
            if (ResultCode != 0) {
                update_details['payment_message'] = "C2B payment failed"
                update_details['resultcode'] = ResultCode;
                if (pre_booking_detail.booking_status === 13) {
                    update_details['mpeas_payment_callback'] = true;
                    let update_booking_detail = await Booking_model.updateOne({ ctob_billRef }, update_details)
                } else {
                    update_details['job_status'] = 11;
                    update_details['booking_status'] = 11;
                    let update_booking_detail = await Booking_model.updateOne({ ctob_billRef }, update_details)
                }
                const error_result = await Booking_model.find({ provider_id: pre_booking_detail.provider_id }).sort({ created_at: -1 });
                let error_booking_detail = await Booking_model.findOne({ ctob_billRef }).lean()
                let data = {
                    user_parent: true,
                    ...error_booking_detail,
                    msg: update_details['payment_message'],
                    status: 'failed',
                    msg_status: 'to_provider'
                }
                await pubsub.publish(APPOINTMENTS, { get_my_appointments: error_result });
                await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                // to user
                let error_invoice_user_data = {
                    user_parent: true,
                    ...error_booking_detail,
                    msg: update_details['payment_message'],
                    status: 'failed',
                    msg_status: 'to_user'
                }
                let error_payment_issues = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: error_invoice_user_data });
                console.log(error_payment_issues, "module.exports.confrimation_call -> error_payment_issues")
                return resolve({ status: true, msg: "Mpesa Payment failed !" })
            }

            if (pre_booking_detail.booking_status === 13) {
                update_details['mpeas_payment_callback'] = false;
                update_details['payment_status'] = 5;
                update_details['booking_status'] = 14;
                update_details['job_status'] = 14;
                update_details['MpesaReceiptNumber'] = body["TransID"];
                update_details['TransactionDate'] = body["TransTime"];
            } else {
                update_details['job_status'] = 10;
                update_details['booking_status'] = 10;
                update_details['MpesaReceiptNumber'] = body["TransID"];
                update_details['TransactionDate'] = body["TransTime"];
            }

            let booking_detail = await Booking_model.findOne({ ctob_billRef })
            let update_booking_detail = await Booking_model.updateOne({ ctob_billRef: ctob_billRef }, update_details)

            if (pre_booking_detail.booking_status === 16) {
                var pay_detail = await Payout_model.update({ booking_id: booking_detail.booking_id }, { booking_status: 14 });
            } else {
                let update_provider_data = {
                    provider_id: booking_detail.provider_id,
                    booking_id: booking_detail._id,
                    amount: String(booking_detail.provider_fee),
                    booking_status: 10
                };
                const update_provider = new Payout_model(update_provider_data);
                const save = await update_provider.save();
            }

            // ================= push_notifiy (to provider) ================== //
            let user_detail = await Detail_model.findOne({ _id: booking_detail.provider_id });
            let app_user_detail = await Detail_model.findOne({ _id: booking_detail.user_id });
            if (user_detail && user_detail.device_id) {
                var notification = {}

                if (pre_booking_detail.booking_status === 13) {
                    notification = {
                        title: 'Complete',
                        body: "User Complete the job",
                        click_action: ".activities.HomeActivity",
                    }
                } else {
                    notification = {
                        title: 'Accept',
                        body: "User Accept The Job",
                        click_action: ".activities.HomeActivity",
                    }
                }
            }
            var message = {
                to: user_detail.device_id,
                notification: notification,
                data: {
                    my_key: commonHelper.pending,
                    my_another_key: commonHelper.pending,
                    booking_id: booking_detail.booking_id
                }
            };
            var msg = await commonHelper.push_notifiy(message);
            // ================= push_notifiy ================== //
            // return response 
            if (pre_booking_detail.booking_status === 13) {
                await commonHelper.send_sms(app_user_detail.country_code, app_user_detail.phone_no, "job_finished", {})
                return resolve({ job_status: 14, msg: "job is completed successfully", status: 'success' });

            } else {
                let data = {
                    user_parent: true,
                    ...booking_detail.data._doc,
                    msg: "user accept the job ",
                    status: 'success',
                    msg_status: 'to_provider'
                }
                const result = await Booking_model.find({ provider_id: booking_detail.provider_id, booking_status: 10 }).sort({ created_at: -1 });
                await commonHelper.send_sms(user_detail.country_code, user_detail.phone_no, "job_assign", {})
                await commonHelper.send_sms(app_user_detail.country_code, app_user_detail.phone_no, "job_placed", {})
                var appointments_details = await pubsub.publish(APPOINTMENTS, { get_my_appointments: result });
                var cancel_provider_to_user = await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: data });
                //to user

                let invoice_user_data = {
                    user_parent: true,
                    ...booking_detail.data._doc,
                    msg: "user accept the job ",
                    status: 'success',
                    msg_status: 'to_user'
                }
                await pubsub.publish(SEND_ACCEPT_MSG, { send_accept_msg: invoice_user_data });
                console.log("module.exports.confrimation_call -> cancel_provider_to_user", cancel_provider_to_user)
                return resolve({ status: true, msg: "Payment Is success !", data })
            }

        } catch (error) {
            console.log("module.exports.confrimation_call -> error", error)
            return reject({ status: false, msg: "Payment Is Failed" })
        }
    })
}


genrate_random = async () => {
    var random = Math.floor(Math.random() * 90000) + 10000;
    var chars = "abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890"
    var random = _.join(_.sampleSize(chars, 20), "")
    var digit = `${random}`
    var check_p_id = await Booking_model.find({ "ctob_billRef": digit });
    if (check_p_id.length) {
        await genrate_random()
    }
    return digit;
}

remove_demo_acount.start();

module.exports.resolvers = resolvers;


