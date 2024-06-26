const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null).min(0),
        price: Joi.number().required(),
        loctaion: Joi.string().required(),
        country: Joi.string().required(),

    }).required()
})
module.exports.reviewSchema = Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),

    }).required()
})