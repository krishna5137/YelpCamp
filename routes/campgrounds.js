const router = require('express').Router();
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');
const asyncError = require('../utils/asyncError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(asyncError(campgrounds.index))
    .post(isLoggedIn, validateCampground, asyncError(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(asyncError(campgrounds.showCampground))
    .put(isLoggedIn, verifyAuthor, validateCampground, asyncError(campgrounds.updateCampground))
    .delete(isLoggedIn, verifyAuthor, asyncError(campgrounds.destroyCampground));

router.get('/:id/edit', isLoggedIn, verifyAuthor, asyncError(campgrounds.renderEditForm));

module.exports = router;