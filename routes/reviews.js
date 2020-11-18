const router = require('express').Router({ mergeParams: true });
const asyncError = require('../utils/asyncError');
const { isLoggedIn, validateReview, verifyReviewAuthor } = require('../middleware');
const Review = require('../models/review');
const CampGround = require('../models/campground');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, asyncError(reviews.createReview));

/**
 * redo later
 * potential bug
 */
router.get('/:r_id', reviews.findReview);
/**
 * Delete a review specific to a camping site
 */
router.delete('/:r_id', isLoggedIn, verifyReviewAuthor, asyncError(reviews.destroyReview));

module.exports = router;