const createError = require('http-errors');
const passport = require('passport');

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('twitter', (error, user, message) => {
    if (error) next(error)
    else if (!user) throw createError(401, message)
    else {
      req.login(user, error => {
        if (error) next(error)
        else res.status(201).json(user)
      })
    }
  })(req, res, next);
}