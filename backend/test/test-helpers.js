/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var Cfg = require('../configuration');
var User = require('../models/internal/user');
var Review = require('../models/internal/review');

module.exports = {
    clearReviews: clearReviews,
    clearUsers: clearUsers,
    connectTestingDb: connectTestingDb,
    disconnectDb: disconnectDb
};

function clearCollection(model, done) {
    if (mongoose.connection.name === 'moviesite-test') {
        model.remove({}, function(err) {
            if (err) throw err;
            done();
        });
    } else {
        done();
    }
}

function clearReviews(done) {
    clearCollection(Review, done);
}

function clearUsers(done) {
    clearCollection(User, done);
}

function connectTestingDb(done) {
    mongoose.connect(Cfg.DB_TESTING_ADDRESS);
    done();
}

function disconnectDb(done) {
    mongoose.disconnect(function() {
        done();
    })
}
