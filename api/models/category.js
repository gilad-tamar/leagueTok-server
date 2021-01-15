const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String },
    gender: { type: String },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);