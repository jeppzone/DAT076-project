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

    var userToken;
    var user2Token;

    before(Helpers.connectTestingDb);
    before(Helpers.clearUsers);
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

    const PROFILE_URL = 'http://localhost:3000/profile';

    it('Should return the user profile', function(done) {
        request(PROFILE_URL)
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
        request(PROFILE_URL)
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

                console.log(body);
                should.exist(body.profile);
                should.exist(body.profile.text);
                should.exist(body.profile.lastActivity);

                done();
            })
    });

    it('Should receive error due to missing token', function(done) {
        request(PROFILE_URL)
            .get('/')
            .send()
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should receive error due to invalid token', function(done) {
        request(PROFILE_URL)
            .get('/')
            .set('authorization', 'this is not really a token')
            .send()
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.TOKEN_INVALID);
                done();
            })
    });


});
