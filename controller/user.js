const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../public/utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");


module.exports.rendersignup = (req, res) => {
    res.render("users/user.ejs");
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        const reguser = await user.register(newuser, password);
        //console.log(reguser);
        req.login(reguser, (err) => {
            if (err) {
                return next;
            }
            req.flash("success", "user registered wel come to wanderlust.com");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }

};

module.exports.renderloginfrom = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", " wel come  back  to  wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    //res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you logged out successful");
        res.redirect("/listings");
    })
};

