const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    size: { type: String },
    quantity: { type: Number }
})

module.exports = mongoose.model('Stock', stockSchema);
