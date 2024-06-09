const Listing = require("../models/listing.js");

module.exports.renderEditform = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });

};
module.exports.renderDestory = async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    //console.log(deletelisting);
    req.flash("success", "deleted listing");
    res.redirect("/listings");
};

module.exports.listingnew = async (req, res, next) => {   //validateSchema, wrapAysnc() validate schema working but so fault in it so for its commented
    let url = req.file.path;
    let filename = req.file.filename;
    //console.log(url, "...", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "new listing is created");

    res.redirect("/listings");
};
module.exports.listingshow = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { path: "author" },
    }).populate("owner");//.populate("reviews")
    //  const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested is not found");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
};
module.exports.listingupdate = async (req, res) => { //showListing//createListing i changed names with that ok

    let { id } = req.params;
    /*  let listing = await Listing.findById(id);
      if (!listing.owner.equals(res.locals.currUser._id)) {
          req.flash("error", "you dont have permission to edit ");
          return res.redirect(`/listings/${id}`);
      }*/
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "updated listing");
    res.redirect(`/listings/${id}`);
};