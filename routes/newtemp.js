const express = require("express");
const router = express.Router(); // Use Router middleware instead of creating a new Express app
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAysnc = require("../public/utils/wrapAsync.js");
const ExpressError = require("../public/utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../shemavalid.js");


const validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    //console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

    }
    else {
        next();
    }

};
// Define routes using the router middleware
router.get("/", async (req, res) => {
    const allistings = await Listing.find({});
    res.render("./listings/index.ejs", { allistings });
});

router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.post("/", validateSchema, wrapAysnc(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

router.get("/:id", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

router.get("/:id/edit", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", validateSchema, wrapAysnc(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router; // Export the router to be used in the main application
