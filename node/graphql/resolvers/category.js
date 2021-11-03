const model = require('../../model_data');
const _ = require('lodash');
const moment = require('moment');
var Jimp = require('jimp');

var Category_model = model.category;
var subCategory_model = model.sub_category;
var Detail_model = model.detail;
var providerSubcategory_model = model.providerSubcategory_model;

const { createWriteStream, existsSync, mkdirSync, fs } = require("fs");
const path = require("path");
const express = require("express");
const files = [];

//  Find all category
module.exports.category = async (parent, args, context, info) => {
    args.delete = 0;
    args.is_block = false;
    var result = await Category_model.find(args);
    console.log(_.size(result),"ops");
    _.map(result,data=>{
        console.log(_.size(result.child_category))
        if(_.size(result.child_category))return data
    })
    console.log(_.size(result),"ops");
    return result;
};

//  Find all category with in subcategory
module.exports.subcategory_category = async (parent, args, context, info) => {
    var result = await Category_model.find({ _id: parent.category_id });
    //console.log(result);
    return result;
};

module.exports.booking_category = async (parent, args, context, info) => {
    var model_name = model.category;
    // console.log("check job send");
    // console.log(parent);
    // console.log("-----------------");
    // console.log(args);

    if (args.category_type == 1) {
        model_name = model.category;
    } else if (args.category_type == 2) {
        model_name = model.sub_category;
    } else {
        model_name = model.category;
    }
    var result = await model_name.find({ _id: args._id });
    // console.log(result);
    return result;
};

module.exports.available_booking_category = async (parent, args, context, info) => {

    var model_name = model.category;
    if (parent.category_type == 1) {
        model_name = model.category;
    } else if (parent.category_type == 2) {
        model_name = model.sub_category;
    } else {
        model_name = model.category;
    }
    var result = await model_name.find({ _id: parent.category_id });
    return result;
};

module.exports.booking_parent_category = async (parent, args, context, info) => {
    if (parent.category_type == 1) {
        return []
    } else if (parent.category_type == 2) {
        var category = await Category_model.find({ _id: parent.category_id });
        return category
    }
};

module.exports.send_job_category = async (parent, args, context, info) => {
    var model_name = model.category;
    if (parent.type == 1) {
        model_name = model.category;
    } else if (parent.type == 2) {
        model_name = model.sub_category;
    } else {
        model_name = model.category;
    }
    var result = await model_name.find({ _id: parent.category_id });
    return result;
};

module.exports.subcategory = async (parent, args, context, info) => {
    args.delete = 0;
    const result = await subCategory_model.find(args)
    // console.log(result);
    return result;
};

module.exports.child_category = async (parent, args, context, info) => {
    const result = await subCategory_model.find({ category_id: parent._id, is_block: false, delete: 0 })
    // console.log(result);
    return result;
};

//get category based on pagination
module.exports.get_category = async (root, args) => {
    var limit = args.limit || 10;
    var page = args.page || 1;
    var offset = Number(page - 1) * Number(limit);
    var data = {};
    if (args.data) {
        data = args.data;
    }
    data.delete = 0;
    // console.log(data)
    var total = await Category_model.count(data);
    var result = await Category_model.find(data).sort({ created_at: -1 }).skip(Number(offset)).limit(args.limit);
    var pageInfo = { totalDocs: total, page: args.page }
    return { data: result, pageInfo };
}


//get category based on pagination
module.exports.get_subcategory = async (parent, args, context, info) => {
    var limit = args.limit || 10;
    var page = args.page || 1;
    var offset = Number(page - 1) * Number(limit);
    var data = {};
    if (args.data) {
        data = args.data;
    }
    data.delete = 0;
    var total = await subCategory_model.count(data);
    var result = await subCategory_model.find(data).sort({ created_at: -1 }).skip(Number(offset)).limit(args.limit);
    // console.log(result);
    var pageInfo = { totalDocs: total, page: args.page }
    return { data: result, pageInfo };
}

//add category { 'category_name','description','file'}

module.exports.addCategory = async (parent, args, { file }) => {
    //console.log("add category");
    //console.log(args);
    if (args.category_name) {
        var pre_name = await Category_model.find({ category_name: args.category_name, delete: 0 });
        if (pre_name.length != 0) {
            return { ...args, ...{ info: { "msg": "This Category name was already selected", status: 'failed' } } };
        }
    }
    if (args.file != undefined && args.file != '') {
        const { createReadStream, filename } = await args.file;
        var file_name = moment().unix() + "_" + filename;
        await new Promise(res =>
            createReadStream().pipe(createWriteStream(path.join(__dirname, "../../images/category", file_name)))
                .on("close", res)
        );
        args['image'] = file_name;
        var file_resize = await Jimp.read(path.join(__dirname, "../../images/category", file_name))
            .then(image => {
                image.resize(260, Jimp.AUTO)
                    .quality(30)
                    .write(path.join(__dirname, "../../images/category", file_name + "_small.jpg"));
            })
            .catch(err => {
                // Handle an exception.
            });
        delete args.file
    }

    if (_.has(args,"base_price")) {
        var base_price = args.base_price.replace("KSh", "");
        if (!Number(base_price)) {
            base_price = 0
        }
        args.base_price = String(parseFloat(Number(base_price)).toFixed(2))
    }
    
    if (_.has(args,"hour_price")) {
        var hour_price = args.hour_price.replace("KSh", "");
        if (!Number(hour_price)) {
            hour_price = 0
        }
        args.hour_price = String(parseFloat(Number(hour_price)).toFixed(2))
    }
    if (_.has(args,"day_price")) {
        var day_price = args.day_price.replace("KSh", "");
        if (!Number(day_price)) {
            day_price = 0
        }
        args.day_price = String(parseFloat(Number(day_price)).toFixed(2))
    }
    const add_category = new Category_model(args);
    const save = await add_category.save();
    //console.log(save);
    var result = await Category_model.find({ category_name: args.category_name });
    //console.log(result);
    if (result.length != 0) {
        //console.log({ ...result[0]._doc, ...{ info: { "msg": "Data added", status: 'success' } } });
        return { ...result[0]._doc, ...{ info: { "msg": "Category Detail Sucessfully Updated", status: 'success' } } };
    } else {
        return { ...result[0]._doc, ...{ info: { "msg": "Category Detail Update Process Failed ", status: 'failed' } } };
    }

};

//  add sub category
module.exports.addsubCategory = async (parent, args, { file }) => {
    // console.log("add sub category");
    // console.log(args);
    if (args.subCategory_name) {
        var pre_name = await subCategory_model.find({ subCategory_name: args.subCategory_name, delete: 0 });
        if (pre_name.length != 0) {
            return { ...args, ...{ info: { "msg": "This Sub Category name was already selected", status: 'failed' } } };
        }
    }
    if (args.file != undefined && args.file != '') {
        const { createReadStream, filename } = await args.file;
        var file_name = moment().unix() + "_" + filename;
        await new Promise(res =>
            createReadStream().pipe(createWriteStream(path.join(__dirname, "../../images/subcategory", file_name)))
                .on("close", res)
        );
        args['image'] = file_name;
        var file_resize = await Jimp.read(path.join(__dirname, "../../images/subcategory", file_name))
            .then(image => {
                image.resize(260, Jimp.AUTO)
                    .quality(30)
                    .write(path.join(__dirname, "../../images/subcategory", file_name + "_small.jpg"));
            })
            .catch(err => {
                // Handle an exception.
            });
        delete args.file
    }
    if (_.has(args,"base_price")) {
        var base_price = args.base_price.replace("KSh", "");
        if (!Number(base_price)) {
            base_price = 0
        }
        args.base_price = String(parseFloat(Number(base_price)).toFixed(2))
    }
    
    if (_.has(args,"hour_price")) {
        var hour_price = args.hour_price.replace("KSh", "");
        if (!Number(hour_price)) {
            hour_price = 0
        }
        args.hour_price = String(parseFloat(Number(hour_price)).toFixed(2))
    }
    if (_.has(args,"day_price")) {
        var day_price = args.day_price.replace("KSh", "");
        if (!Number(day_price)) {
            day_price = 0
        }
        args.day_price = String(parseFloat(Number(day_price)).toFixed(2))
    }
    const add_subcategory = new subCategory_model(args);
    const save = await add_subcategory.save();
    var result = await subCategory_model.find({ subCategory_name: args.subCategory_name });
    if (result.length != 0) {
        //console.log({ ...result[0]._doc, ...{ info: { "msg": "Data added", status: 'success' } } });
        return { ...result[0]._doc, ...{ info: { "msg": "Sub Category Detail Sucessfully Updated", status: 'success' } } };
    } else {
        return { ...result[0]._doc, ...{ info: { "msg": "Sub Category Detail Update Process Failed ", status: 'failed' } } };
    }
};
//update category 
module.exports.updateCategory = async (parent, args, { file }) => {
    //console.log(args);
    var fs = require('fs');
    if (args.category_name) {
        var pre_name = await Category_model.find({ category_name: args.category_name, delete: 0 });
        if (pre_name.length > 1) {
            return { ...args, ...{ info: { "msg": "This Category name was already selected", status: 'failed' } } };
        }
    }
    if (args.file != undefined) {
        const { createReadStream, filename } = await args.file;
        if (filename != undefined) {
            var file_name = moment().unix() + "_" + filename;
            await new Promise(res =>
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "../../images/category", file_name)))
                    .on("close", res)
            );
            args['image'] = file_name;
            var file_resize = await Jimp.read(path.join(__dirname, "../../images/category", file_name))
                .then(image => {
                    image.resize(260, Jimp.AUTO)
                        .quality(30)
                        .write(path.join(__dirname, "../../images/category", file_name + "_small.jpg"));
                })
                .catch(err => {
                    // Handle an exception.
                });
            delete args.file;
            // delete the old file
            await Category_model.find({ _id: args._id }, (err, data) => {
                if (typeof data[0].image == 'undefined' || data[0].image == '') {
                    //console.log(" file not upload");
                } else {
                    //console.log("start file delete");
                    var file = path.join(__dirname, "../../images/category", data[0].image);
                    fs.unlink(file, function (err) {
                        //console.log("delete image");
                    });
                }
            });
        }
    }
    if (_.has(args,"base_price")) {
        var base_price = args.base_price.replace("KSh", "");
        if (!Number(base_price)) {
            base_price = 0
        }
        args.base_price = String(parseFloat(Number(base_price)).toFixed(2))
    }
    
    if (_.has(args,"hour_price")) {
        var hour_price = args.hour_price.replace("KSh", "");
        if (!Number(hour_price)) {
            hour_price = 0
        }
        args.hour_price = String(parseFloat(Number(hour_price)).toFixed(2))
    }
    if (_.has(args,"day_price")) {
        var day_price = args.day_price.replace("KSh", "");
        if (!Number(day_price)) {
            day_price = 0
        }
        args.day_price = String(parseFloat(Number(day_price)).toFixed(2))
    }
    var result = await Category_model.update({ _id: args._id }, args);
    //console.log(result);
    if (result.n == result.nModified) {
        return { ...args, ...{ info: { "msg": "Update Process Success", status: 'success' } } };
    } else {
        return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
    }
};

//update sub_category
module.exports.updatesubCategory = async (parent, args, { file }) => {
    //console.log(args.file);
    try {

        if (args.subCategory_name) {
            var pre_name = await subCategory_model.find({ subCategory_name: args.subCategory_name, delete: 0 });
            if (pre_name.length > 1) {
                return { ...args, ...{ info: { "msg": "This Sub Category name was already selected", status: 'failed' } } };
            }
        }
        if (args.file != undefined) {
            //console.log("file");
            const { createReadStream, filename } = await args.file;
            if (filename != undefined) {
                var file_name = moment().unix() + "_" + filename;
                await new Promise(res =>
                    createReadStream().pipe(createWriteStream(path.join(__dirname, "../../images/subcategory", file_name)))
                        .on("close", res)
                );
                args['image'] = file_name;
                var file_resize = await Jimp.read(path.join(__dirname, "../../images/subcategory", file_name))
                    .then(image => {
                        image.resize(260, Jimp.AUTO)
                            .quality(30)
                            .write(path.join(__dirname, "../../images/subcategory", file_name + "_small.jpg"));
                    })
                    .catch(err => {
                        // Handle an exception.
                    });
                delete args.file

                // delete the old file
                var fs = require('fs');
                await subCategory_model.find({ _id: args._id }, (err, data) => {
                    if (typeof data[0].image == 'undefined' || data[0].image == '') {
                        // console.log(" file not upload");
                    } else {
                        // console.log("start file delete");
                        var file = path.join(__dirname, "../../images/subcategory", data[0].image);
                        fs.unlink(file, function (err) {
                            // console.log("delete image");
                        });
                    }
                });
            }
        }
        if (_.has(args,"base_price")) {
            var base_price = args.base_price.replace("KSh", "");
            if (!Number(base_price)) {
                base_price = 0
            }
            args.base_price = String(parseFloat(Number(base_price)).toFixed(2))
        }
        
        if (_.has(args,"hour_price")) {
            var hour_price = args.hour_price.replace("KSh", "");
            if (!Number(hour_price)) {
                hour_price = 0
            }
            args.hour_price = String(parseFloat(Number(hour_price)).toFixed(2))
        }
        if (_.has(args,"day_price")) {
            var day_price = args.day_price.replace("KSh", "");
            if (!Number(day_price)) {
                day_price = 0
            }
            args.day_price = String(parseFloat(Number(day_price)).toFixed(2))
        }
        var result = await subCategory_model.update({ _id: args._id }, args);
        //console.log(result);
        if (result.n == result.nModified) {
            return { ...args, ...{ info: { "msg": "Update Process Success", status: 'success' } } };
        } else {
            return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
        }

    } catch (error) {
        // console.log("module.exports.updatesubCategory -> error", error)
        return { ...args, ...{ info: { "msg": "Update Process Failed !", status: 'failed' } } };
    }
};

//delete category 
module.exports.deleteCategory = async (parent, args) => {
    var sub_result_warning = await subCategory_model.count({ category_id: args._id, delete: 0 });
    var provider_result_warning = await Detail_model.count({ provider_subCategoryID: { $in: [args._id] }, delete: 0 });
    if (sub_result_warning > 0) {
        return { "msg": "This category can`t delete because may be under some more sub_category !", status: 'failed' };
    }
    if (provider_result_warning > 0) {
        return { "msg": "This category can`t delete because may be  some more Provider chosse this category !", status: 'failed' };
    }
    var result = await Category_model.update({ _id: args._id }, { delete: 1 });
    if (result.n == result.nModified) {
        var sub_result = await subCategory_model.updateMany({ category_id: args._id }, { delete: 1 });
        return { "msg": "Delete Process Success", status: 'success' };
    } else {
        return { "msg": "Delete Process Failed !", status: 'failed' };
    }
};

//delete sub_category
module.exports.deletesubCategory = async (parent, args) => {
    var provider_result_warning = await Detail_model.count({ provider_subCategoryID: { $in: [args._id] }, delete: 0 });
    if (provider_result_warning > 0) {
        return { "msg": "This category can`t delete because may be  some more Provider chosse this category !", status: 'failed' };
    }
    var result = await subCategory_model.update({ _id: args._id }, { delete: 1 });
    if (result.n == result.nModified) {
        return { "msg": "Delete Process Success", status: 'success' };
    } else {
        return { "msg": "Delete Process Failed !", status: 'failed' };
    }
};

//  add sub category id in provider
module.exports.addProvider_Category = async (parent, args) => {
    //console.log(args);
    var addProvider_category = await Detail_model.update({ "user_id": args.user_id }, { "$push": { "provider_subCategoryID": args.provider_subCategoryID } });
    let add_category = new providerSubcategory_model({ "user_id": args.user_id, "subcategory_id": args.provider_subCategoryID });
    await add_category.save();
    return addProvider_category;
};

//  remove  sub category id in provider
module.exports.deleteProvider_Category = async (parent, args) => {
    //console.log(args);
    var deleteProvider_Category = await Detail_model.update({ "user_id": args.user_id }, { "$pull": { "provider_subCategoryID": { $in: args.provider_subCategoryID } } });
    //console.log(deleteProvider_Category);
    return deleteProvider_Category;
};


module.exports.search_category = async (parent, args, context, info) => {
    // console.log("search_category");
    //console.log(args);
    var category_result = await Category_model.find({ category_name: { $regex: args.data.value, $options: 'i' }, delete: 0, is_block: false }).limit(2);
    var sub_category_result = await subCategory_model.find({ subCategory_name: { $regex: args.data.value, $options: 'i' }, delete: 0, is_block: false }).limit(3);
    return [...category_result, ...sub_category_result];
};

module.exports.search_category_only = async (parent, args, context, info) => {
    return Category_model.find({ category_name: { $regex: args.data.value, $options: 'i' }, delete: 0 }).limit(5);
};

module.exports.search_sub_category_only = async (parent, args, context, info) => {
    return await subCategory_model.find({ subCategory_name: { $regex: args.data.value, $options: 'i' }, delete: 0 }).limit(5);
};

module.exports.search_category_mobile = async (parent, args, context, info) => {
    var category_result = await Category_model.find({ category_name: { $regex: args.data, $options: 'i' }, delete: 0, is_block: false }).limit(2);
    var sub_category_result = await subCategory_model.find({ subCategory_name: { $regex: args.data, $options: 'i' }, delete: 0, is_block: false }).limit(3);
    return [...category_result, ...sub_category_result];
};

module.exports.get_is_future = async (parent, args, context, info) => {
    var category_result = await Category_model.find({ is_future: true, is_block: false, delete: 0 });
    var sub_category_result = await subCategory_model.find({ is_future: true, is_block: false, delete: 0 });
    return [...category_result, ...sub_category_result];
};


module.exports.change_parent_bolck = async (parent, args, context, info) => {
    var category_result = await Category_model.update({ _id: args._id }, { is_block: args.is_block }, { new: true });
    var sub_count = await subCategory_model.count({ category_id: args._id });
    if (sub_count > 0) {
        var sub_category_result = await subCategory_model.updateMany({ category_id: args._id }, { is_block: args.is_block }, { new: true });
        if (sub_category_result.n == sub_category_result.nModified) {
            return { info: { msg: "Update process success", status: "success" } };
        }
    } else {
        return { info: { msg: "Update process success", status: "success" } };
    }

};
