const mongoose = require("mongoose");

const betSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    day: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day"
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
    stateBet: {
      type: Boolean,
      default: false
    },
    points: {
      type: Number,
      default:0
    }
  },
  {
    timestamps: true,
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

module.exports = mongoose.model("Bet", betSchema);
