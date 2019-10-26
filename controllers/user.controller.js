const User = require('../models/user.model');

module.exports.getAll = (req, res, next) => {
  User.find()
    .populate('bets')
    .then(users => res.status(200).json(users))
    .catch(next)
}

module.exports.getById = (req, res, next) => {
  User.findById(req.params.id)
    .populate('bets')
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found');
      } else {
        console.log(user)
        res.status(200).json(user);
      }
    })
    .catch(next);
}

module.exports.getClassification = (req, res, next) => {
  User.find()
    .then(users => {
      const table = users.filter( n => n.points > 0).sort( (a,b) => b.points - a.points)
      res.status(200).json(table)
    } )
}


module.exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
      .then(user =>
            res.status(200).json())
      .catch(error => next(error));
}