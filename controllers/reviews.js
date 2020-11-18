const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${campground.id}`);
}
/**
 * helper to redirect user to prev page
 * when trying to delete a review without logging in
 */
module.exports.findReview = (req, res) => {
    const { id } = req.params;
    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, r_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: r_id } });
    await Review.findByIdAndDelete(r_id);
    req.flash('success', 'Review Deleted Successfully');
    res.redirect(`/campgrounds/${id}`);
}