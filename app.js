require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('./configs/session.config');
const cors = require('./configs/cors.config');

require('./configs/db.config');
require('./configs/passport.config');

const sessionsRouter = require('./routes/sessions.routes');
const usersRouter = require('./routes/users.routes');
const daysRouter = require('./routes/days.routes')

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('SuperArgo'));
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors);

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
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
