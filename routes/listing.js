const express = require("express");
const router = express.Router();
//const a = require("../shemavalid.js");
const wrapAysnc = require("../public/utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../shemavalid.js");
const flash = require('connect-flash');
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const ExpressError = require("../public/utils/ExpressError.js");
// controller 
const listingController = require("../controller/listing.js");
//multer for files upload
const multer = require('multer');
const { storage } = require("../cloudconfig.js");

const upload = multer({ storage });

//it must in middle ware js file but i not add same also in review
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
// router path same 
router.route("/")
    .get(async (req, res) => {
        const allistings = await Listing.find({});
        res.render("./listings/index.ejs", { allistings });
    })
    .post(isLoggedIn, upload.single('listing[image]'), validateSchema, wrapAysnc(listingController.listingnew)); // validateschema as change to last which was firts due to cloud setup


//new route
router.get("/new", isLoggedIn, (req, res) => {
    // controller in that index and new route is not add  lec MVC 
    res.render("./listings/new.ejs");
});

router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateSchema, wrapAysnc(listingController.listingupdate))
    .get(wrapAysnc(listingController.listingshow))
    //.put(isLoggedIn, isOwner, validateSchema, wrapAysnc(listingController.listingupdate))
    .delete(isLoggedIn, isOwner, wrapAysnc(listingController.renderDestory));


//index
/*

router.get("/", async (req, res) => {
    const allistings = await Listing.find({});
    res.render("./listings/index.ejs", { allistings });
});*/




// show route for adding create new route
//router.post("/", validateSchema, isLoggedIn, wrapAysnc(listingController.listingnew)); //showListing//createListing i changed names with that ok

//show route
//router.get("/:id", wrapAysnc(listingController.listingshow));
// EDIT ROUTE 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAysnc(listingController.renderEditform));

// update route
//router.put("/:id", isLoggedIn, isOwner, validateSchema, wrapAysnc(listingController.listingupdate));
// DELETE ROUTE
//router.delete("/:id", isLoggedIn, isOwner, wrapAysnc(listingController.renderDestory));


module.exports = router;