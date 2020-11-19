const router = require('express').Router();
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');
const asyncError = require('../utils/asyncError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

//  a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const multer = require('multer');
const { storage } = require('../cloudinary/config')
const upload = multer({ storage });

router.route('/')
    .get(asyncError(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, asyncError(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(asyncError(campgrounds.showCampground))
    .put(isLoggedIn, verifyAuthor, validateCampground, asyncError(campgrounds.updateCampground))
    .delete(isLoggedIn, verifyAuthor, asyncError(campgrounds.destroyCampground));

router.get('/:id/edit', isLoggedIn, verifyAuthor, asyncError(campgrounds.renderEditForm));

module.exports = router;