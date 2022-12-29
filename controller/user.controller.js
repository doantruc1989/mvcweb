var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../models/user');
var Product = require('../models/product');
var CartOrder = require('../models/cartOrder');
var DailyReport = require('../models/dailyReport');
var moment = require('moment');
const schedule = require('node-schedule');

// save daily report
async function scheduleReport() {
    // let x = moment().subtract(8, 'day').format("YYYY-MM-DD");
    const date = new Date();
    const todayDate = date.toLocaleDateString(`fr-CA`).split('/').join('-');
    const orderToday = await CartOrder.find().where({ "createdAt": { "$gte": `${todayDate}T00:00:00.000Z`, "$lt": `${todayDate}T23:59:59.999Z` } });
    let todaySale = 0;
    for (let i = 0; i < orderToday.length; i++) {
        todaySale += orderToday[i].totalAmount;
    };

    let revenueProductToday = 0;
    let revenueTotay = 0;
    for (let i = 0; i < orderToday.length; i++) {
        let revenue = orderToday[i].cart.items
        let product = Object.keys(revenue)
        for (let j = 0; j < product.length; j++) {
            let inititalPrice = revenue[product[j]].item.initialPrice;
            let salePrice = revenue[product[j]].item.price;
            let qty = revenue[product[j]].qty;
            revenueProductToday = (salePrice - inititalPrice) * qty;
            revenueTotay += revenueProductToday;
        }
    };
    var cronExpress = '* 34 10 * * *';
    let newDailyReport = new DailyReport()
    newDailyReport.dailySale = todaySale;
    newDailyReport.dailyRevenue = revenueTotay;
    await schedule.scheduleJob(cronExpress, function () {
        newDailyReport.save()
    });
}
scheduleReport();

module.exports.getSignup = function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup');
};

module.exports.getSignin = function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin');
};

module.exports.getAdmin = async function (req, res, next) {
    const orderTotal = await CartOrder.find().limit(8).lean();
    let totalSale = 0;
    for (let i = 0; i < orderTotal.length; i++) {
        totalSale += orderTotal[i].totalAmount;
    };

    const date = new Date();
    const todayDate = date.toLocaleDateString(`fr-CA`).split('/').join('-');
    const orderToday = await CartOrder.find().where({ "createdAt": { "$gte": `${todayDate}T00:00:00.000Z`, "$lt": `${todayDate}T23:59:59.999Z` } });
    let todaySale = 0;
    for (let i = 0; i < orderToday.length; i++) {
        todaySale += orderToday[i].totalAmount;
    };

    let revenueProductToday = 0;
    let revenueTotay = 0;
    for (let i = 0; i < orderToday.length; i++) {
        let revenue = orderToday[i].cart.items
        let product = Object.keys(revenue)
        for (let j = 0; j < product.length; j++) {
            let inititalPrice = revenue[product[j]].item.initialPrice;
            let salePrice = revenue[product[j]].item.price;
            let qty = revenue[product[j]].qty;
            revenueProductToday = (salePrice - inititalPrice) * qty;
            revenueTotay += revenueProductToday;
        }
    };

    const product = await Product.find().where('qty').lte(20).lean();

    let revenueProduct = 0;
    let revenueTotal = 0;
    for (let i = 0; i < orderTotal.length; i++) {
        let revenue = orderTotal[i].cart.items
        let product = Object.keys(revenue)
        for (let j = 0; j < product.length; j++) {
            let inititalPrice = revenue[product[j]].item.initialPrice;
            let salePrice = revenue[product[j]].item.price;
            let qty = revenue[product[j]].qty;
            revenueProduct = (salePrice - inititalPrice) * qty;
            revenueTotal += revenueProduct;
        }
    };




    res.render('admin/home', {
        totalSale: totalSale,
        todaySale: todaySale,
        orderTotal: orderTotal,
        revenueTotal: revenueTotal,
        revenueTotay: revenueTotay,
        product, product,
        layout: false
    });
}

module.exports.getReport = async function (req, res, next) {
    const orderTotal = await CartOrder.find().limit(8).lean();
    const dailyReport = await DailyReport.find().limit(7).lean();
    let report = { orderTotal, dailyReport }
    res.json(report);
}

module.exports.getRSreport = async function (req, res, next) {
    res.render('admin/SR-report', { layout: false })
}

module.exports.getAdminTableUser = async function (req, res, next) {
    const user = await User.find().lean()
    res.render('admin/adminuser', { user: user, layout: false });
}

module.exports.getAdminTableUserEdit = async function (req, res, next) {
    const user = await User.findById({ _id: req.body.edit })
    user.role = req.body.role;
    user.save();
    res.redirect('/user/admin/table/user')
}

module.exports.getAdminTableUserdelete = async function (req, res, next) {
    await User.findByIdAndDelete({ _id: req.body.delete })
    res.redirect('/user/admin/table/user')
}

module.exports.getAdminTableProduct = async function (req, res, next) {
    const product = await Product.find().lean()
    res.render('admin/adminproduct', { product: product, layout: false })
}

module.exports.getAdminTableProductInsert = async function (req, res, next) {
    console.log(req.body)
    let newProduct = new Product();
    newProduct.title = req.body.name;
    newProduct.description = req.body.description;
    newProduct.initialPrice = req.body.initialPrice;
    newProduct.price = req.body.price;
    newProduct.qty = req.body.quantity;
    newProduct.imagePath = req.body.image;
    await newProduct.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
        }
    });
    res.redirect("/user/admin/table/product");
}

module.exports.getAdminTableProductEdit = async function (req, res, next) {

    const product = await Product.findById({ _id: req.body.edit }).lean()
    console.log(product)
    res.render('admin/adminproductedit', { product: product, layout: false })

}

module.exports.getAdminTableProductEditSave = async function (req, res, next) {
    console.log(req.body);
    const editedProduct = await Product.findById({ _id: req.body.edit })
    editedProduct.title = req.body.title;
    editedProduct.description = req.body.description;
    editedProduct.price = req.body.price;
    editedProduct.initialPrice = req.body.initialPrice;
    editedProduct.qty = req.body.qty;
    editedProduct.imagePath = req.body.imagePath;
    await editedProduct.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
        }
    });
    res.redirect('/user/admin/table/product');
}

module.exports.getAdminTableProductDelete = async function (req, res, next) {
    console.log(req.body.delete)
    await Product.findOneAndDelete({ _id: req.body.delete })
    res.redirect('/user/admin/table/product')
}

module.exports.getWeeklyreport = async function (req, res, next) {
    res.render('admin/weeklyreport', { layout: false });
}

