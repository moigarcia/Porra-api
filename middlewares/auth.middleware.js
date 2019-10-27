const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else throw createError(403);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.status(401)
    next();
  }
}

module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      next(createError(403, 'Insufficient privileges'))
    }
  }
}