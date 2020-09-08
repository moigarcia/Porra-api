const expressSession = require("express-session");
const connectMongo = require("connect-mongo")
const mongoose = require("mongoose");

const MongoStore = connectMongo(expressSession)

const session = expressSession({
  secret: 'SuperArgo',
  saveUninitialized: true,
  // proxy: true, 
  cookie: {
    secure: 'auto',
    // httpOnly: true,
    maxAge:  24 * 60 * 60 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl:  3600
  })
});

module.exports = session