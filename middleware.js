const { campgroundSchema, reviewSchema } = require('./validateSchemas.js');
const CampGround = require('./models/campground');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currentUrl = req.originalUrl;
        req.flash('error', 'Must be signed-in');
        return res.redirect('/login');
    }
    next();
}

/**
 * Server-side campground validation
 */
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * Server-side reviews model validation
 */
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

/**
 * Authorization middleware
 */
module.exports.verifyAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Need permissions to modify');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

