require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const passport = require('passport');
const cors = require('cors');

require('./configs/db.config');
require('./configs/passport.config');

const sessionsRouter = require('./routes/sessions.routes');
const usersRouter = require('./routes/users.routes');
const daysRouter = require('./routes/days.routes')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('SuperArgo'));
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy'); 

app.use(session({
  secret: 'SuperArgo',
  resave: true,
  saveUninitialized: true,
  // proxy: true, 
  cookie: {
    secure: "auto",
    maxAge: 60 * 60 * 24 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.URL_APP,// allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
    credentials: true // allow session cookie from browser to pass through
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/auth', sessionsRouter);
app.use('/users', usersRouter);
app.use('/days', daysRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
