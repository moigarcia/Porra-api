const passport = require('passport');
const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/create',authMiddleware.isNotAuthenticated, sessionsController.create);
router.get('/delete',sessionsController.delete);

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect', passport.authenticate('twitter',
  { successRedirect: '/home', 
    failureRedirect: '/' }));
//router.get('/twitter/callback', passport.authenticate('twitter'))

module.exports = router;
