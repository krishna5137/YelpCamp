const router = require('express').Router();

const asyncError = require('../utils/asyncError');
const ExpressError = require('../utils/ExpressError');

const CampGround = require('../models/campground');

const { campgroundSchema } = require('../validateSchemas.js');

/**
 * Server-side campground validation
 */
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', asyncError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, asyncError(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

router.delete('/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;