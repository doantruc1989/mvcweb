var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    amount: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    updatedAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('Transaction', schema);