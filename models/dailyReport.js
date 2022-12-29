var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    dailySale: { type: Number, required: true },
    dailyRevenue: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('DailyReport', schema);