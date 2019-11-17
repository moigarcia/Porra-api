const passport = require("passport");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: process.env.URL_APP_DEV,
    failureRedirect: "auth/login/failed"
  })
);


router.get("/login/success", (req, res) => {
  console.log("login success ",req.user)
  if (req.user) {
    res.status(200).json(req.user)
  } 
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  //res.redirect(process.env.URL_APP_DEV);
});
module.exports = router;
