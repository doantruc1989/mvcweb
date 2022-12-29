var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    weeklySale: { type: Number, required: true },
    weeklyRevenue: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('WeeklyReport', schema);