var express = require('express');
var router = express.Router();
var controller = require('../controller/index.controller')
var Cart = require('../models/cart');
var Product = require('../models/product');
// var Order = require('../models/order');
/* GET home page. */
router.get('/', controller.getHome);
router.get('/search', controller.getSearch);
router.get('/cart', controller.cartPage);
router.get('/xbox', controller.getXbox);
router.get('/playstation', controller.getPS);
router.get('/wii', controller.getWii);
router.get('/nintendo', controller.getNintendo);

router.get('/product', controller.getAllProduct);
router.get('/product/:id', controller.getProduct);

router.get('/checkout', controller.getCheckOut);
router.post('/checkout', controller.postCheckout);
router.post('/checkout/savecart', controller.saveCart)
router.get('/add-to-cart/:id', controller.getCart);
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
module.exports = router;
