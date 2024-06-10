if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

//console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
 
const path = require("path");
const methodOverride = require("method-override");
const wrapAysnc = require("./public/utils/wrapAsync.js");
const ExpressError = require("./public/utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./shemavalid.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

 
const engine = require('ejs-mate');
const { send } = require("process");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const userrouter = require("./routes/userro.js")
//const mongooseurl = 'mongodb://127.0.0.1:27017/wanderlusr';
const dbUrl = process.env.ATLASDB_URL;
const Review = require("./models/reviews.js");
const flash = require('connect-flash');
const passport = require("passport");//started 
const LocalStatergy = require("passport-local");
const user = require("./models/user.js");

const { Schema } = mongoose;//doc
// requireing ejs
app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "mysupersecretcode",

    },
    touchAfter: 24 * 3600,
});
store.on("err", () => {
    console.log("error in mongostore", err);
});
//session - express in cookies 
const Sessionoptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 10000,
        maxage: 7 * 24 * 60 * 60 * 10000,
        httpOnly: true,
    },
};

/*
app.get("/", (req, res) => {
    res.send("hi i am root");
});*/

app.use(session(Sessionoptions));
//flash
app.use(flash());
//app.use(require('flash')());


//passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// passport
/*
app.get("/demouser", async (req, res) => {
    let fakeuser = new user({
        email: "akash.r.pattar@gmail.com",
        username: "akashpattar",
    });
    let reguser = await user.register(fakeuser, "helloworld");
    res.send(reguser);
});

*/

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/", userrouter);


main()
    .then(() => {
        console.log("connect to db");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl);
}



// const validation
/*
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

};*/

//review schema

/*
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

};*/
/*

//index

app.get("/listings", async (req, res) => {
    const allistings = await Listing.find({});
    res.render("./listings/index.ejs", { allistings });
});


//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
})

// show route for adding create new route
app.post("/listings", validateSchema, wrapAysnc(async (req, res, next) => {   //validateSchema, wrapAysnc() validate schema working but so fault in it so for its commented

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}
));*/
// reviews route
/*
app.post("/listings/:id/reviews", validateReview, wrapAysnc(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    listing.reviews.push(newReview);
    //  console.log(newReview);
    await newReview.save();
    await listing.save();
    //console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)

}));

*/



/*

//show route
app.get("/listings/:id", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");//.populate("reviews")
    //  const listing = await Listing.findById(id);

    res.render("./listings/show.ejs", { listing });
}));
// EDIT ROUTE 
app.get("/listings/:id/edit", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update route
app.put("/listings/:id", validateSchema, wrapAysnc(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));
// DELETE ROUTE
app.delete("/listings/:id", wrapAysnc(async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    //console.log(deletelisting);
    res.redirect("/listings");
}));

*/

// delete review route

/*
app.delete("/listings/:id/reviews/:reviewId", wrapAysnc(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}));*/






























// error call
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});


// custom error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "some thing went wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});













/*

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "AKASH hotel",
        description: "bt th beach",
        image: "sell",
        price: 1200,
        loctaion: "bagalkot",
        country: "india",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");

});*/

app.listen(3000, () => {
    console.log("server is working");
});
