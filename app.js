const createError = require('http-errors');
const express = require('express');
const indexRouter = require('./routes/index');
const middleware = require('./middleware');
const database = require("./database");
var path = require('path');

const app = express();

app.use(express.json({
  limit: "5mb",
  verify: (req, res, buff) => {
    req.rawBody = buff;
  },
}));

app.use(express.urlencoded({ extended: false }));
app.use(middleware);
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// database connection
database.connect();

// base routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
