const router = require('express').Router({ mergeParams: true });
const asyncError = require('../utils/asyncError');
const { validateReview } = require('../middleware');
const Review = require('../models/review');
const CampGround = require('../models/campground');

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