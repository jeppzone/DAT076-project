var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Cfg = require('./configuration');
var Promise = require('bluebird');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

// Routes
var index = require('./routes/index');
var movies = require('./routes/movies');
var users = require('./routes/users');

var app = express();

// Connect to database. Testing database if "test" is supplied as an argument
if (process.argv.some(function(arg) {
        return arg === 'test';
    })) {
    mongoose.connect(Cfg.DB_TESTING_ADDRESS);
} else {
    mongoose.connect(Cfg.DB_ADDRESS);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index(express));
app.use('/movies', movies(express));
app.use('/users', users(express));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
});

module.exports = app;
