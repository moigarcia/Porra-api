const Bet = require("../models/bets.model");
const Day = require("../models/day.model");
const User = require("../models/user.model");
const createError = require("http-errors");

module.exports.getAll = (req, res, next) => {
  Day.findById(req.params.id)
    .populate("bets")
    .then(day => res.status(200).json(day.bets))
    .catch(error => next(error));
};

module.exports.getById = (req, res, next) => {
  Bet.findById(req.params.id)
    .then(bet => {
      if (!bet) {
        throw createError(404, "bet not found");
      } else {
        console.log(bet);
        res.status(200).json(bet);
      }
    })
    .catch(error => next(error));
};

module.exports.doBet = (req, res, next) => {
  const betData = {
    resultLocalTeam: req.body.resultLocalTeam,
    resultVisitingTeam: req.body.resultVisitingTeam,
    user: req.body.userId,
    day: req.params.id,
    scorers: req.body.scorers
  };

  Day.findById(req.params.id)
    .populate("bets")
    .then(day => {
      if (day.stateDay !== "open") {
        throw createError(
          404,
          "El partido está cerrado, no se permite más resultados."
        );
      } else if (day.bets.some(n => n.user == req.body.userId)) {
        throw createError(
          404,
          "No puedes añadir más resultados, ya has hecho tu apuesta"
        );
      } else {
        const bet = new Bet(betData);
        bet
          .save()
          .then(bet => {
            res.status(201).json(bet);
          })
          .catch(error => next(error));
      }
    })
    .catch(error => next(error));
};

module.exports.checkBets = (req, res, next) => {
  Day.findByIdAndUpdate(req.params.id, {$set: { stateDay: "closed"}}, { new: true })
    .populate("bets")
    .then(day => {
      if (day.stateDay !== "closed") {
        const finalResult = {
          resultLocalTeam: day.resultLocalTeam,
          resultVisitingTeam: day.resultVisitingTeam,
          scorers: day.scorers
        };

        const betsDay = day.bets;

        const resultAndScorers = (finalResult, betsDay) => {
          const resultMatch = betsDay.filter(
            n =>
              n.resultLocalTeam === finalResult.resultLocalTeam &&
              n.resultVisitingTeam === finalResult.resultVisitingTeam
          );
          const scorers = finalResult.scorers;

          return resultMatch.map(n => {
            n.stateBet = "true";
            let count = 0;
            for (var i = 0; i < n.scorers.length; i++) {
              if (scorers.includes(n.scorers[i])) {
                count++;

                n.points = count * 3 + 5;
              }
            }
            if (n.points === 0) {
              n.points = 5;
            }
            return n;
          });
        };

        const result = resultAndScorers(finalResult, betsDay);

        const options = { safe: true, upsert: false, new: true };

        const promises = result.map(bet => {
          const update = { $set: { points: bet.points, stateBet: true } };
          return new Promise(function(resolve, reject) {
            Bet.findByIdAndUpdate(
              bet.id,
              update,
              options,
              (err, betUpdated) => {
                if (err) return reject(err);
                if (!betUpdated) return reject(new Error("Error desconocido"));
                return resolve(betUpdated);
              }
            );
          });
        });

        return Promise.all(promises).then(results => {
          results.map(n => {
            User.findById(n.user).then(user => {
              console.log(user);
              const total = user.points + n.points;
              user.set("points", total);
              user.save().then(console.log("actualizada clasificacion"));
            });
          });
          return res.status(200).json(results);
        });
      } else {
        throw createError(404, "Esta jornada está cerrada y checkeada");
      }
    })
    .catch(error => next(error));
};

module.exports.delete = (req, res, next) => {
  Bet.findByIdAndRemove(req.params.id)
    .then(day => res.status(200).json())
    .catch(error => next(error));
};

module.exports.deleteAll = (req, res, next) => {
  Bet.deleteMany({})
    .then(day => res.status(200).json())
    .catch(error => next(error));
};
