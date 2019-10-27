const passport = require('passport');

module.exports.create = (req, res, next) => {
  res.render('sessions/create');
}

module.exports.delete = (req, res, next) => {
  req.logout()
  res.redirect('/sessions/create')
}

module.exports.createWithIDPCallback = (req, res, next) => {
  passport.authenticate(`${req.params.provider}-auth`, (errors, user) => {
    if (errors) {
      next(errors);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/')
        }
      })
    }
  })(req, res, next);
}