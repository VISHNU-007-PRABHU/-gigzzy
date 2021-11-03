var multer = require('multer')
const model = require('../../model_data');
var Status_model = model.status;
var Detail_model = model.detail;
var Booking_modal = model.booking;
const moment = require('moment');
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const commonHelper = require('../commonHelper');
const path = require("path");
const express = require("express");
const files = [];

module.exports.status = async (_, args) => {
    args.delete = 0;
    var result = await Status_model.find(args);
    //console.log(result);
    return result;
};



module.exports.online_status = async (parent, args) => {
    //console.log(args);
    var document_verified = await Detail_model.updateOne({ _id: args._id, }, { online: args.online_status });
    if (args.online_status == 1) {
        var data = await Detail_model.findOne({ _id: args._id });
        return { ...data._doc, "msg": "Status Update Success", status: 'success' };
    } else {
        return { "msg": "Status Update Failed !", status: 'failed' };
    }
};

/*
    @params(role:Int,booking_id:ID)
*/
module.exports.update_msg_is_read = async (parent, args) => {
    var msg_count_data = {};
    if (args.role == 1) {
        msg_count_data['user_msg_count'] = 0;
        msg_count_data['user_msg_is_read'] = 0;
    } else if (args.role == 2) {
        msg_count_data['provider_msg_count'] = 0;
        msg_count_data['provider_msg_is_read'] = 0;
    }
    var update_count_refersh = await Booking_modal.updateOne({ _id: args.booking_id, }, msg_count_data, { new: true });
    return { msg: "refresh msg count", status: "success" }
};

module.exports.add_providerDocument = async (_, args, { file }) => {
    // console.log(args);
    // console.log(args.file.length);
    if (args.user_id == undefined || args.user_id == '' || args.user_id == null) {
        return { msg: "please check user id", status: "failed" };
    }
    if (args.file != '') {
        var img_data = [];
        for (let i = 0; i < args.file.length; i++) {
            // console.log(i);
            var img = {}
            const { createReadStream, filename } = await args.file[i];
            if (filename != undefined) {
                var file_name = moment().unix() + "_" + filename;
                await new Promise(res =>
                    createReadStream()
                        .pipe(createWriteStream(path.join(__dirname, "../../images/provider/document", file_name)))
                        .on("close", res)
                );
                img_data.push(file_name);
            }
        }
        // console.log(img_data);
        if (args.option == "personal") {
            if (img_data.length > 0) {
                for (let j = 0; j < img_data.length; j++) {
                    console.log('ceh',j);
                    var dhdjf= await Detail_model.updateOne({ "_id": args.user_id }, { $push: { personal_document: img_data[j] } },{new:true});
                    console.log(dhdjf);
                }
                var data = await Detail_model.findOne({ _id: args.user_id });
                data.msg = "upload success";
                data.status = "success";
                // console.log(data);
                return data;
            }
        } else if (args.option == "professional") {
            // console.log("professional");
            // console.log(img_data.length);
            if (img_data.length > 0) {
                for (let j = 0; j < img_data.length; j++) {
                    console.log('ceh',j);
                 var df= await Detail_model.updateOne({ "_id": args.user_id }, { $push: { professional_document: img_data[j] } },{new:true});
                    // console.log(df);
                }
                console.log("professional return");
                var data = await Detail_model.findOne({ _id: args.user_id });
                data.msg = "upload success";
                data.status = "success";
                // console.log(data);
                return data;
            }
        }

    } else {
        return { msg: "upload failed", status: "failed" };
    }
};

/*
    @params(user_id:ID,filename:String,option:String);
*/
module.exports.delete_providerDocument = async (_, args) => {
    var fs = require('fs');
    var result = {};
    var request = {}
    var myArray = args.filename.split("/");
    var file_name = myArray[myArray.length - 1];
    // console.log(file_name);
    if (args.option == "personal") {
        request = { personal_document: file_name }
    } else if (args.option == "professional") {
        request = { professional_document: file_name }
    }
    var file = path.join(__dirname, "../../images/provider/document", file_name);
    fs.unlink(file, function (err) { console.log("delete image"); });

    var data = await Detail_model.updateOne({ _id: args.user_id }, { $pull: request });
    if (data.n == data.nModified) {
        return { msg: "Document removed", status: "success" };
    } else {
        return { msg: "Document can`t removed", status: "failed" };
    }

};