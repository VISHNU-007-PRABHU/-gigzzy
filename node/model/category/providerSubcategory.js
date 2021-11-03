var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create user schema 


var providerSubcategorySchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    subcategory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sub_category' },
});

var providerSubcategory = mongoose.model('providerSubcategory', providerSubcategorySchema);

module.exports = providerSubcategory;