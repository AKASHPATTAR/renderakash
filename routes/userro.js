const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../public/utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup", userController.rendersignup); //1

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderloginfrom);//2

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);
router.get("/logout", userController.logout)










module.exports = router;