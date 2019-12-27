const passport = require("passport");
const express = require("express");
const router = express.Router();

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: process.env.URL_APP,
    failureRedirect: "auth/login/failed"
  })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    const user = {
      id: req.user.id,
      provider: req.user.provider,
      name: req.user.name,
      userTwitter: req.user.userTwitter,
      photo: req.user.photo,
      role: req.user.role,
      points: req.user.points
    };

    req.session.save(() => res.status(200).json(user));
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    message: "user logout."
  });
});
module.exports = router;
