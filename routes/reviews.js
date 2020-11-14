const router = require('express').Router({ mergeParams: true });

const asyncError = require('../utils/asyncError');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../validateSchemas.js');

const Review = require('../models/review');
const CampGround = require('../models/campground');

/**
 * Server-side reviews model validation
 */
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${campground.id}`);
}));

/**
 * Delete a review specific to a camping site
 */
router.delete('/:r_id', asyncError(async (req, res) => {
    const { id, r_id } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: r_id } });
    await Review.findByIdAndDelete(r_id);
    req.flash('success', 'Review Deleted Successfully');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;