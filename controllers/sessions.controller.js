const passport = require('passport');

module.exports.create = (req, res, next) => {
  res.render('sessions/create');
}

module.exports.delete = (req, res, next) => {
  req.logout()
  res.redirect('/sessions/create')
}
