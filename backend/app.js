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

var app = express();

// Connect to database. Testing database if "test" is supplied as an argument
if (process.argv.some(function(arg) {
        return arg === 'test';
    })) {
    mongoose.connect(Cfg.DB_TESTING_ADDRESS);
} else {
    mongoose.connect(Cfg.DB_ADDRESS);
}

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index(express));

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
