const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Joi custom extensions
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const customJoi = Joi.extend(extension);

module.exports.campgroundSchema = customJoi.object({
    campground: customJoi.object({
        title: customJoi.string().required().escapeHTML(),
        price: customJoi.number().required().min(1),
        description: customJoi.string().required().escapeHTML(),
        location: customJoi.string().required().escapeHTML()
    }).required(),
    deleteImages: customJoi.array()
});

module.exports.reviewSchema = customJoi.object({
    review: customJoi.object({
        body: customJoi.string().required().escapeHTML(),
        rating: customJoi.number().required().min(1).max(5)
    }).required()
});