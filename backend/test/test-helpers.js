/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var Cfg = require('../configuration');
var User = require('../models/internal/user');
var Profile = require('../models/internal/profile');
var Review = require('../models/internal/review');

module.exports = {
    clearReviews: clearReviews,
    clearUsers: clearUsers,
    clearProfiles: clearProfiles,
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

function clearProfiles(done) {
    clearCollection(Profile, done);
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
