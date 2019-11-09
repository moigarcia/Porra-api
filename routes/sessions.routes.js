const passport = require("passport");
const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessions.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const CLIENT_HOME_PAGE_URL = "https://porra-litris.herokuapp.com/home";

router.get(
  "/create",
  authMiddleware.isNotAuthenticated,
  sessionsController.create
);
router.get("/delete", sessionsController.delete);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "auth/login/failed"
  })
);


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
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
  res.redirect(CLIENT_HOME_PAGE_URL);
});
module.exports = router;
