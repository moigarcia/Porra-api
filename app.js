require('dotenv').config();

const cookieSession = require("cookie-session");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('./configs/session.config');
const passport = require('passport');
const cors = require('cors');

require('./configs/db.config');
require('./configs/passport.config');

const sessionsRouter = require('./routes/sessions.routes');
const usersRouter = require('./routes/users.routes');
const daysRouter = require('./routes/days.routes')

const app = express();


app.use(session)

app.use(cookieParser());

app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use(
  cors({
    origin: '*',// allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', sessionsRouter);
app.use('/users', usersRouter);
app.use('/days', daysRouter);

const authCheck = (req, res, next) => {
  console.log("app authcheck", req.user)
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

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
