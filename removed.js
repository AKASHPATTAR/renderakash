/*
module.exports.isOwner = async (req, res, next) => { // not working is owner in workin model listing .js
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission to edit ");
        return res.redirect(`/listings/${id}`);
    }

}; 
// part project phase 2 part e last 3 video*/

/*module.exports.isreviewAuthor = async (req, res, next) => { // not working is owner in workin model listing .js
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the auhtor of this review ");
        return res.redirect(`/listings/${id}`);
    }

};*/
