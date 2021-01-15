const mongoose = require('mongoose');
const Stock = require('../models/stock');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    gender: { type: String },
    brand: { type: String },
    image: { type: String, required: true},
    price: { type: Number, required: true },
    stock: [{type: String},{type: Number}],
    dateAdded: { type: Date, required: true},
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' }
});

module.exports = mongoose.model('Product', productSchema);