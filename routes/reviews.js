const router = require('express').Router({ mergeParams: true });
const asyncError = require('../utils/asyncError');
const { isLoggedIn, validateReview, verifyReviewAuthor } = require('../middleware');
const Review = require('../models/review');
const CampGround = require('../models/campground');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, asyncError(reviews.createReview));

router.route('/:r_id')
    .get(reviews.findReview) // redo potential bug
    .delete(isLoggedIn, verifyReviewAuthor, asyncError(reviews.destroyReview)); //Delete a review specific to a camping site

module.exports = router;