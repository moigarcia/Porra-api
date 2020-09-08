const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  console.log("auth ", req.user)
  if (req.isAuthenticated()){
    return next();
  } else {
    next(createError(403, 'Not authenticated'));
  }
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