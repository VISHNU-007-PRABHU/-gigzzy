const model = require('../../model_data');
const _ = require('lodash');
const moment = require('moment');
var Category_model = model.category;
var subCategory_model = model.sub_category;
var Detail_model = model.detail;
var providerSubcategory_model = model.providerSubcategory_model;
var Certificate_model = model.certificate;

const { createWriteStream, existsSync, mkdirSync, fs } = require("fs");
const path = require("path");
const express = require("express");
const files = [];

module.exports.certificate = async (parent, args, context, info) => {
    args.delete=0;
    var result = await Certificate_model.find(args);
    //console.log(result);
    return result;
};

module.exports.get_certificate = async (parent, args, context, info) => {
    var limit = args.limit || 10 ;
    var page = args.page || 1 ;
    var offset = Number(page -1) * Number(limit);
    
    var total = await Certificate_model.count({ delete: 0 });
    var result = await Certificate_model.find({ delete: 0 }).sort({created_at:-1}).skip(Number(offset)).limit(args.limit);
    var pageInfo={totalDocs:total,page:args.page}
    return { data:result,pageInfo};
};


module.exports.add_certificate = async (_, args, { file }) => {
    //console.log("add certificate");
     if (args.certificate_name) {
        var pre_name = await Certificate_model.find({ certificate_name: args.certificate_name,delete:0 });
        if (pre_name.length != 0) {
            return { ...args, ...{ info: { "msg": "This Certificate name was already selected", status: 'failed' } } };
        }
    }
    const add_certificate = new Certificate_model(args);
    const save = await add_certificate.save();
    var result = await Certificate_model.find({ certificate_name: args.certificate_name });
    if (result.length != 0) {
        return { ...result[0]._doc, ...{ info: { "msg": "Certificate Detail Sucessfully Updated", status: 'success' } } };
    } else {
        return { ...result[0]._doc, ...{ info: { "msg": "Certificate Detail Update Process Failed ", status: 'failed' } } };
    }

};

//update category 
module.exports.update_certificate = async (parent, args, { file }) => {
    //console.log(args);
    if (args.certificate_name) {
        var pre_name = await Certificate_model.find({ certificate_name: args.certificate_name,delete:0 });
        if (pre_name.length != 0) {
            return { ...args, ...{ info: { "msg": "This Certificate name was already selected", status: 'failed' } } };
        }
    }
    var result = await Certificate_model.update({ _id: args._id }, args);
    if (result.n == result.nModified) {
        return { ...args, ...{ info: { "msg": "Update Process Success", status: 'success' } } };
    } else {
        return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
    }
};

//delete certificate
module.exports.delete_certificate = async (parent, args) => {
    var certificate_result_warning = await Certificate_model.count({ _id : args._id ,delete: 0});
    if(certificate_result_warning > 0){
        return { "msg": "This certificate can`t delete because may be  some more category chosse this certificate !", status: 'failed' };
    }
    var result = await Certificate_model.update({ _id: args._id }, { delete: 1 });
    if (result.n == result.nModified) {
        return { "msg": "Delete Process Success", status: 'success' };
    } else {
        return { "msg": "Delete Process Failed !", status: 'failed' };
    }
};
