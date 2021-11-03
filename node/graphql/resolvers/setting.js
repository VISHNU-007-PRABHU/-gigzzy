const model = require('../../model_data');
const _ = require('lodash');
const moment = require('moment');
const { createWriteStream, existsSync, mkdirSync, fs } = require("fs");
const path = require("path");
const express = require("express");
const files = [];

var Category_model = model.category;
var subCategory_model = model.sub_category;
var Detail_model = model.detail;
var providerSubcategory_model = model.providerSubcategory_model;
var payout_setting = model.payout_setting;
var site_setting = model.site_setting;


module.exports.site_setting_detail = async (parent, args, context, info) => {
    var result = await site_setting.findOne(args);
    // console.log(result);
    return result;
};

//update site 
module.exports.add_site_detail = async (parent, args, { file }) => {
    //console.log(args);
    var result = await site_setting.find({});
    //console.log(result);
    if (result.length == 0) {
        const add_site_data = new site_setting(args);
        const save = await add_site_data.save();
        return { "msg": "Data added", status: 'success' };
    } else {
        var result = await site_setting.update({ _id: result[0]._id }, args);
        //console.log(result);
        if (result.n == result.nModified) {
            return { "msg": "Update Process Success", status: 'success' };
        } else {
            return { "msg": "Update Process Failed !", status: 'failed' };
        }
    }
};

//update img 
module.exports.update_site_img = async (parent, args) => {
    var img = ''
    var data = {};
    //console.log(args);
    //console.log("check upload");
    if (args.file != undefined ) {
        const { createReadStream, filename } = await args.file;
        // console.log(filename);
        // console.log(createReadStream);
        if (filename != undefined) {
            var file_name = moment().unix() + "_" + filename;
            await new Promise(res =>
                createReadStream().pipe(createWriteStream(path.join(__dirname, "../../images/public", file_name))).on("close", res)
            );
            img = file_name;
        }
        delete args.file
    }
    //console.log(args);
    var result = await site_setting.find({});
    if (result.length == 0) {
        if (args.option == 1) {
            args.img_icon = img;
        } else if (args.option == 2) {
            args.img_logo = img;
        }
        const add_site_data = new site_setting(args);
        const save = await add_site_data.save();
        return { "msg": "Data added", status: 'success' };
    } else {
        if (args.option == 1) {
            data = await site_setting.update({ _id: result[0]._id }, { img_icon: img }, { new: true });
        } else if (args.option == 2) {
            data = await site_setting.update({ _id: result[0]._id }, { img_logo: img }, { new: true });
        }
        var booking = await site_setting.findOne({ _id: result[0]._id });
        if (data.n == data.nModified) {
            booking.msg = "file upload success";
            booking.status = "success";
            return booking;
        } else {
            //console.log("file upload failed");
            booking.msg = "file upload failed";
            booking.status = "failed";
            return booking;
        }
    }
},


    module.exports.payout_setting_detail = async (parent, args, context, info) => {
       //console.log("dhjsb");
        var result = await payout_setting.findOne(args);
        //console.log(result);
        return result;
    };

//update site 
module.exports.add_payout_detail = async (parent, args, { file }) => {
    //console.log(args);
    var result = await payout_setting.find({});
    if (result.length == 0) {
        const add_site_data = new payout_setting(args);
        const save = await add_site_data.save();
        if (result.length != 0) {
            return { "msg": "Payout Setting Sucessfully Updated", status: 'success' };
        } else {
            return { "msg": "Payout Setting Update Process Failed ", status: 'failed' };
        }
    } else {
        var result = await payout_setting.update({ _id: result[0]._id }, args);
        //console.log(result);
        if (result.n == result.nModified) {
            return { "msg": "Update Process Success", status: 'success' };
        } else {
            return { "msg": "Update Process Failed !", status: 'failed' };
        }
    }
};

