const model = require('../../model_data');
const _ = require('lodash');
const moment = require('moment');
var Category_model = model.category;
var subCategory_model = model.sub_category;
var Detail_model = model.detail;
var providerSubcategory_model = model.providerSubcategory_model;
var static_model = model.static;
var message_model = model.message;

const { createWriteStream, existsSync, mkdirSync, fs } = require("fs");
const path = require("path");
const express = require("express");
const files = [];

module.exports.static = async (parent, args, context, info) => {
    args.delete=0;
    var result = await static_model.find(args);
    //console.log(result);
    return result;
};

module.exports.get_static = async (parent, args, context, info) => {
    var limit = args.limit || 10 ;
    var page = args.page || 1 ;
    var offset = Number(page -1) * Number(limit);
    
    var total = await static_model.count({ delete: 0 });
    var result = await static_model.find({ delete: 0}).sort({created_at:-1}).skip(Number(offset)).limit(args.limit);
    var pageInfo={totalDocs:total,page:args.page}
    return { data:result,pageInfo};
};

//add static 
module.exports.add_static = async (_, args, { file }) => {
    //console.log("add static");
    const add_static = new static_model(args);
    const save = await add_static.save();
    var result = await static_model.find({ page_code: args.page_code });
    if (result.length != 0) {
        return { ...result[0]._doc, ...{ info: { "msg": "Static Data Sucessfully Updated", status: 'success' } } };
    } else {
        return { ...result[0]._doc, ...{ info: { "msg": "User Detail Update Process Failed ", status: 'failed' } } };
    }

};

//update static 
module.exports.update_static = async (parent, args, { file }) => {
    //console.log(args);
    var result = await static_model.update({ _id: args._id }, args);
    //console.log(result);
    if (result.n == result.nModified) {
        return { ...args, ...{ info: { "msg": "Update Process Success", status: 'success' } } };
    } else {
        return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
    }
};

//delete static
module.exports.delete_static = async (parent, args) => {
    var result = await static_model.update({ _id: args._id }, { delete: 1 });
    if (result.n == result.nModified) {
        return { "msg": "Delete Process Success", status: 'success' };
    } else {
        return { "msg": "Delete Process Failed !", status: 'failed' };
    }
};

module.exports.get_message = async (parent, args, context, info) => {
    var total = await message_model.count({});
    var result = await message_model.find({booking_id:args.booking_id});
    //console.log(result);
    return result;
};
