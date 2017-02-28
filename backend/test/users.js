/**
 * Created by Oskar Jönefors on 2017-02-28.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var User = require('../models/internal/user');

var Errors = require('../errors');
var Helpers = require('./test-helpers');
var Status = require('http-status-codes');

var Tokens = require('../middleware/tokens');
var UsersMW = require('../middleware/users');

describe("Get users", function() {

    const URL = "http://localhost:3000/users";

    const validUser = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "hunter2"
    };

    const validUser2 = {
        username: "TheValidUser2",
        email: "valid2@user.com",
        password: "hunter2"
    };

    const validProfileText = "Welcome to my awesome profile!";
    const tooLongProfileText = new Array(4000).join("X");

    var userToken;
    var user2Token;

    before(Helpers.connectTestingDb);
    before(Helpers.clearUsers);
    before(Helpers.clearProfiles);
    before(function (done) {
        UsersMW.register(validUser)
            .then(function (pubUser) {
                userToken = pubUser.token;
                done();
            })
    });

    before(function (done) {
        UsersMW.register(validUser2)
            .then(function (pubUser) {
                user2Token = pubUser.token;
                done();
            })
    });

    after(Helpers.disconnectDb);

    it('Should find user by username', function(done) {

        request(URL)
            .get('/' + encodeURIComponent(validUser.username))
            .send()
            .end(function(err, res) {

                res.status.should.equal(Status.OK);

                should.exist(res.body);
                var body = res.body;

                should.exist(body.username);
                body.username.should.equal(validUser.username);

                done();
            })
    });

    it('Should find user by username', function(done) {

        request(URL)
            .get('/' + encodeURIComponent(validUser.username.toUpperCase()))
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                res.status.should.equal(Status.OK);

                should.exist(res.body);
                var body = res.body;

                should.exist(body.username);
                body.username.should.equal(validUser.username);

                done();
            });
    });

    it('Should not find nonexisting user', function(done) {
        request(URL)
            .get('/barbapappa')
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                res.status.should.equal(Status.NOT_FOUND);

                done();
            })
    });

    const MY_PROFILE_URL = 'http://localhost:3000/profile';

    it('Should return the user profile', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .set('authorization', userToken)
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                should.exist(res.body);
                var body = res.body;

                should.exist(body.user);
                should.exist(body.user.username);
                body.user.username.should.equal(validUser.username);

                should.exist(body.user.email);
                body.user.email.should.equal(validUser.email);

                should.exist(body.profile);
                should.exist(body.profile.text);
                should.exist(body.profile.lastActivity);
                done();
            })
    });

    it('Should return the user profile', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .set('authorization', user2Token)
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                should.exist(res.body);
                var body = res.body;

                should.exist(body.user);
                should.exist(body.user.username);
                body.user.username.should.equal(validUser2.username);

                should.exist(body.user.email);
                body.user.email.should.equal(validUser2.email);

                should.exist(body.profile);
                should.exist(body.profile.text);
                should.exist(body.profile.lastActivity);

                done();
            })
    });

    it('Should receive error due to missing token', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .send()
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should receive error due to invalid token', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .set('authorization', 'this is not really a token')
            .send()
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.TOKEN_INVALID);
                done();
            })
    });

    it('Should return the other user profile', function(done) {
        request(URL)
            .get('/' + encodeURIComponent(validUser.username) + '/profile')
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                should.exist(res.body);
                var body = res.body;

                should.exist(body.user);
                should.exist(body.user.username);
                body.user.username.should.equal(validUser.username);

                should.not.exist(body.user.email);

                should.exist(body.profile);
                should.exist(body.profile.text);
                should.exist(body.profile.lastActivity);
                done();
            })
    });

    it('Should not return profile of nonexistant user', function(done) {
        request(URL)
            .get('/the_donald/profile')
            .send()
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.NOT_FOUND);
                done();
            })
    });

    it('Should update the profile of the given user', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', userToken)
            .send({text: validProfileText})
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Status.OK);

                should.exist(res.body);
                var body = res.body;

                should.exist(body.user);
                var user = body.user;

                should.exist(user.username);
                user.username.should.equal(validUser.username);

                should.exist(user.email);
                user.email.should.equal(validUser.email);

                should.exist(body.profile);
                var profile = body.profile;

                should.exist(profile.text);
                profile.text.should.equal(validProfileText);

                should.exist(profile.lastActivity);

                done();
            })
    });

    it('Should fail to update the profile since the profile text is too long', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', userToken)
            .send({text: tooLongProfileText})
            .end(function (err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.VALIDATION_ERROR);
                done();
            })
    });

    it('Should fail to update the profile due to missing text attribute', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', userToken)
            .send({texxxxt: validProfileText})
            .end(function (err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.VALIDATION_ERROR);
                done();
            })
    });

    it('Should fail to update the profile due to missing token', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .send({text: validProfileText})
            .end(function (err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.VALIDATION_ERROR);
                done();
            })
    });

    it('Should fail to update the profile due to invalid token', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', 'LET ME IN PLZ')
            .send({text: validProfileText})
            .end(function (err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.TOKEN_INVALID);
                done();
            })
    });

});
