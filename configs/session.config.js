const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = session({
  name: "session",
  secret: 'deestavidasacarasloquemetasnadamas',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: 'auto'
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
})