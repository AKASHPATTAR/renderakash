const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");




module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must login into wanderlust");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
//const Listing = require('../models/listing');

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/"); // Adjust this redirect as per your application flow
        }

        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have permission to edit this listing");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        console.error("Error in isOwner middleware:", err);
        req.flash("error", "Something went wrong");
        return res.redirect("/"); // Adjust this redirect as per your application flow
    }
};


// chatgpt
module.exports.isreviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        console.error("Error in isreviewAuthor middleware:", err);
        req.flash("error", "Something went wrong");
        return res.redirect(`/listings/${id}`);
    }
};
