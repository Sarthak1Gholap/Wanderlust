const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const userControllers = require("../controllers/users");
const passport = require("passport");
const { saveRedirectUrl, isloggedin } = require("../middleware.js");

const register = async (user, password) => {
  // Implement the registration logic
  return {
    user: user,
    message: "User registered successfully",
  };
};

router.get("/signup", userControllers.renderSignup);

router.post('/signup', userControllers.signup);

router.get("/login", userControllers.renderLogin);

router.post('/login', saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userControllers.login
);

router.get("/logout", userControllers.logout);

module.exports = router;