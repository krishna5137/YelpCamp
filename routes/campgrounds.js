const router = require('express').Router();
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');
const asyncError = require('../utils/asyncError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

router.get('/',
    asyncError(campgrounds.index));

router.get('/new',
    isLoggedIn,
    campgrounds.renderNewForm);

router.post('/',
    isLoggedIn,
    validateCampground,
    asyncError(campgrounds.createCampground));

router.get('/:id',
    asyncError(campgrounds.showCampground));

router.get('/:id/edit',
    isLoggedIn,
    verifyAuthor,
    asyncError(campgrounds.renderEditForm));

router.put('/:id',
    isLoggedIn,
    verifyAuthor,
    validateCampground,
    asyncError(campgrounds.updateCampground));

router.delete('/:id',
    isLoggedIn,
    verifyAuthor,
    asyncError(campgrounds.destroyCampground));

module.exports = router;