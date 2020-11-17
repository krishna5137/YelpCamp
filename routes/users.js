const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const asyncError = require('../utils/asyncError');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', asyncError(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, err => {  // passport middleware th automatically login newly registered user
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Bye-Bye!');
    res.redirect('/campgrounds');
});


module.exports = router;