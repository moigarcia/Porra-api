const mongoose = require("mongoose");
const Bet = require("./bets.model");

const DaySchema = new mongoose.Schema(
  {
    number: Number,
    localTeam: {
      type: String
      //enum: teams.map(team => team.name)
    },
    visitingTeam: {
      type: String
      //enum: teams.map(team => team.name)
    },
    resultLocalTeam: {
      type: Number,
      min: 0,
      default: 0
    },
    resultVisitingTeam: {
      type: Number,
      min: 0,
      default: 0
    },
    scorers: {
      type: Array,
      //enum: players.map(player => player.name),
      default: []
    },
    stateDay: {
      type: String,
      enum: ["pending", "open", "closed"],
      default: "open"
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

DaySchema.virtual("bets", {
  ref: Bet.modelName,
  localField: "_id",
  foreignField: "day",
  options: { sort: { createdAt: -1 } }
});

module.exports = mongoose.model("Day", DaySchema);
