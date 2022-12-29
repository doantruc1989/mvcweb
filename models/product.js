var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    initialPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    updatedAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('Product', schema);