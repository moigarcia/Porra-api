const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    userTwitter: String,
    provider: String,
    provider_id: { type: String, unique: true },
    photo: String,
    points: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["admin", "guest"],
      default: "guest"
    },
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

UserSchema.virtual('bets', {
  ref: 'Bet', 
  localField: '_id', 
  foreignField: 'user', 
  justOne: false,
  options: { sort: { createdAt: -1 } } 
 });

module.exports = mongoose.model("User", UserSchema);

