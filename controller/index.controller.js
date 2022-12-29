var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var CartOrder = require('../models/cartOrder');

module.exports.getHome = async function (req, res, next) {
    const products = await Product.find().limit(6).lean();
    const first4 = await Product.find().limit(4).lean();
    res.render('shop/index', { products: products, first4: first4 });
};

module.exports.getXbox = async function (req, res, next) {
    const product = await Product.find().where('description', { $regex: "xbox" }).lean();
    console.log(product);
    res.render('shop/xbox', { product: product })
}

module.exports.getWii = async function (req, res, next) {
    const product = await Product.find().where('description', { $regex: "Wii" }).lean();
    console.log(product);
    res.render('shop/wii', { product: product })
}

module.exports.getPS = async function (req, res, next) {
    const product = await Product.find().where('description', { $regex: "PS" }).lean();
    console.log(product);
    res.render('shop/playstation', { product: product })
}

module.exports.getNintendo = async function (req, res, next) {
    const product = await Product.find().where('description', { $regex: "nintendo" }).lean();
    console.log(product);
    res.render('shop/nintendo', { product: product })
}

module.exports.getSearch = async function (req, res, next) {
    const search = req.query.search;
    const myArray = search.split(" ");
    let product;
    for (let i = 0; i < myArray.length; i++) {
        product = await Product.find(
            {
                $or: [
                    { 'title': { '$regex': myArray[i], '$options': 'i' } },
                    { 'description': { '$regex': myArray[i], '$options': 'i' } }
                ]
            }
        ).lean();
    }
    res.render('shop/search', { product: product })
}

module.exports.getCart = async function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');

    });
}

module.exports.getAllProduct = async function (req, res, next) {
    console.log(req.query.page)
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skipProduct = (page - 1) * perPage;
    const product = await Product.find().limit(perPage).skip(skipProduct).lean()
    res.render('shop/product', { product: product })
}

module.exports.getProduct = async function (req, res, next) {
    const product = await Product.findById(req.params.id).lean();;
    res.render('shop/productdetail', { product: product });
}

module.exports.cartPage = async function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    // console.log(Object.keys(cart.items))
    // console.log(cart.generateArray())
    res.render('shop/cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
}

module.exports.saveCart = async function (req, res, next) {
    let newCart = new CartOrder();
    newCart.user = req.user;
    newCart.cart = req.session.cart;
    newCart.totalAmount = req.session.cart.totalPrice;
    await newCart.save();

    let cartItems = Object.keys(newCart.cart.items);
    // console.log(cartItems[0])
    // console.log(newCart.cart.items[cartItems[0]])
    for (let i = 0; i < cartItems.length; i++) {
        const product = await Product.findById({ _id: newCart.cart.items[cartItems[i]].item._id })
        product.qty = product.qty - newCart.cart.items[cartItems[i]].qty;
        product.save()
    }
    res.redirect('/checkout');
}

module.exports.getCheckOut = async function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { products: cart.generateArray(), cart: cart, errMsg: errMsg, noError: !errMsg });
}

module.exports.postCheckout = function (req, res, next) {
    // if (!req.session.cart) {
    //     return res.redirect('/shopping-cart');
    // }
    // var cart = new Cart(req.session.cart);

    // var stripe = require("stripe")(
    //     "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
    // );

    // stripe.charges.create({
    //     amount: cart.totalPrice * 100,
    //     currency: "usd",
    //     source: req.body.stripeToken, // obtained with Stripe.js
    //     description: "Test Charge"
    // }, function (err, charge) {
    //     if (err) {
    //         req.flash('error', err.message);
    //         return res.redirect('/checkout');
    //     }
    //     var order = new Order({
    //         user: req.user,
    //         cart: cart,
    //         address: req.body.address,
    //         name: req.body.name,
    //         paymentId: charge.id
    //     });
    //     order.save(function (err, result) {
    //         req.flash('success', 'Successfully bought product!');
    //         req.session.cart = null;
    //         res.redirect('/');
    //     });
    // });
}
