const Day = require("../models/day.model");
const Bet = require("../models/bets.model");
const createError = require("http-errors");

module.exports.getAll = (req, res, next) => {
  Day.find()
    .populate("bets")
    .then(days => {
      console.log(days);
      res.status(200).json(days);
    })
    .catch(error => next(error));
};

module.exports.getById = (req, res, next) => {
  Day.findById(req.params.id)
    .populate("bets")
    .then(day => {
      if (!day) {
        throw createError(404, "day not found");
      } else {
        console.log(day);
        res.status(200).json(day);
      }
    })
    .catch(error => next(error));
};

module.exports.createDay = (req, res, next) => {
  const newDay = new Day(req.body);
  newDay
    .save()
    .then(day => res.status(201).json(day))
    .catch(error => next(error));
};

module.exports.updateDay = (req, res, next) => {
  if (req.body.stateDay !== "closed") {
    Day.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("bets")
      .then(day => {
        res.status(202).json(day);
      })
      .catch(error => next(error));
  } else {
    throw createError(404, "Ya no se puede modificar esta jornada");
  }
};


module.exports.delete = (req, res, next) => {
  Day.findByIdAndRemove(req.params.id)
    .then(day => res.status(200).json())
    .catch(error => next(error));
};

module.exports.deleteAll = (req, res, next) => {
  Day.deleteMany({})
    .then(day => res.status(200).json())
    .catch(error => next(error));
};
