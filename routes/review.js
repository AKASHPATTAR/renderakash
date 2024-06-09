const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAysnc = require("../public/utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const review = require("../models/reviews.js")
const { listingSchema, reviewSchema } = require("../shemavalid.js");
const { isLoggedIn, isreviewAuthor } = require("../middleware.js");
const ExpressError = require("../public/utils/ExpressError.js");
const controllerReview = require("../controller/review.js");
//const listing = require("../routes/listing.js");


const Review = require("../models/reviews.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    //console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

    }
    else {
        next();
    }

};

router.post("/", validateReview, isLoggedIn, wrapAysnc(controllerReview.createReview));
router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAysnc(controllerReview.destoryReview));
module.exports = router;
