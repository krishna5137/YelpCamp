const router = require('express').Router();
const { isLoggedIn, validateCampground, verifyAuthor } = require('../middleware');
const asyncError = require('../utils/asyncError');
const ExpressError = require('../utils/ExpressError');

const CampGround = require('../models/campground');

const { campgroundSchema } = require('../validateSchemas.js');




router.get('/', asyncError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, asyncError(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', isLoggedIn, verifyAuthor, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, verifyAuthor, validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;

    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Requested Campground doesn\'t exist');
        return res.redirect('/campgrounds');
    }
    //console.log(campground.author, res.locals);
    res.render('campgrounds/show', { campground });
}));

router.delete('/:id', isLoggedIn, verifyAuthor, asyncError(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Campground deletion successful!');
    res.redirect('/campgrounds');
}));

module.exports = router;