const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview);

    //  console.log(newReview);
    await newReview.save();
    await listing.save();
    //console.log("new review saved");
    req.flash("success", "new review is added");
    res.redirect(`/listings/${listing._id}`)

};
module.exports.destoryReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    req.flash("success", " review is deleted");
    res.redirect(`/listings/${id}`);
}