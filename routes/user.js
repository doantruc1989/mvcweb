var express = require('express');
var router = express.Router();
var controller = require('../controller/user.controller')
var passport = require('passport');

router.get('/profile', isLoggedIn, isUser, function (req, res, next) {
    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});



router.get('/signup', controller.getSignup)

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', controller.getSignin)

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.get('/admin', isLoggedIn, isAdmin, controller.getAdmin)
router.get('/admin/table/user', isLoggedIn, isAdmin, controller.getAdminTableUser)
router.post('/admin/table/user/edit', isLoggedIn, isAdmin, controller.getAdminTableUserEdit);
router.post('/admin/table/user/delete', isLoggedIn, isAdmin, controller.getAdminTableUserdelete);
router.get('/admin/table/product', isLoggedIn, isAdmin, controller.getAdminTableProduct)
router.post('/admin/table/product/insert', isLoggedIn, isAdmin, controller.getAdminTableProductInsert);
router.post('/admin/table/product/edit', isLoggedIn, isAdmin, controller.getAdminTableProductEdit)
router.post('/admin/table/product/edit/done', isLoggedIn, isAdmin, controller.getAdminTableProductEditSave)
router.post('/admin/table/product/delete', isLoggedIn, isAdmin, controller.getAdminTableProductDelete)
router.get('/admin/report', isLoggedIn, isAdmin, controller.getReport)
router.get('/admin/sale-revenue-report', isLoggedIn, isAdmin, controller.getRSreport)
router.get('/admin/weeklyreport', isLoggedIn, isAdmin, controller.getWeeklyreport)


router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (req.user.role > 0) {
        return next();
    }
    res.send('access denied');
}

function isUser(req, res, next) {
    if (req.user.role < 1) {
        return next();
    }
    res.redirect('/user/admin');
}
