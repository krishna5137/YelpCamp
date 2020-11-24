const express = require('express');
const passport = require('passport');
const router = express.Router();
//const User = require('../models/user');
const asyncError = require('../utils/asyncError');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(asyncError(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Bye-Bye!');
    res.redirect('/');
});

module.exports = router;