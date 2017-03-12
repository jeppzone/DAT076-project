var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoSanitize = require('express-mongo-sanitize');

var Cfg = require('./configuration');
var Promise = require('bluebird');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

// Routes
var index = require('./routes/index');
var movies = require('./routes/movies');
var reviews = require('./routes/reviews');
var users = require('./routes/users');
var lists = require('./routes/lists');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Input sanitation to prevent MongoDB injection attacks
app.use(mongoSanitize());

// Connect to database. Testing database if "test" is supplied as an argument
if (process.argv.some(function(arg) {
        return arg === 'test';
    })) {
    mongoose.connect(Cfg.DB_TESTING_ADDRESS);
} else {
    mongoose.connect(Cfg.DB_ADDRESS);
}
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', ['X-Requested-With,content-type', 'Authorization', 'authorization']);

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index(express));
app.use('/movies', movies(express));
app.use('/reviews', reviews(express));
app.use('/users', users(express));
app.use('/lists', lists(express));

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
