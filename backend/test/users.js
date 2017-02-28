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


});
