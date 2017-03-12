/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');

var Errors = require('../errors');
var Helpers = require('./test-helpers');
var Status = require('http-status-codes');

describe("Register and log in user", function() {

    const URL = "http://localhost:3000";

    const validUser = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "hunter2"
    };

    const usernameCollision = {
        username: "The Valid User",
        email: "valid2@user.com",
        password: "hunter2"
    };

    const emailCollision = {
        username: "The Valid User2",
        email: "valid@user.com",
        password: "hunter2"
    };

    const invalidUsername = {
        username: "q",
        email: "valid@user.com",
        password: "hunter2"
    };

    const invalidEmail = {
        username: "The Valid User",
        email: "invalid.com",
        password: "hunter2"
    };

    const shortPassword = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "h"
    };

    const longPassword = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "Never Gonna Give You Up is a single by Rick Astley, released in 1987, written and produced by Stock" +
        " Aitken Waterman. The song was released as the first single from his debut album, Whenever You Need Somebody " +
        "(1987). The song was a worldwide number-one hit, initially in the singer's native United Kingdom in 1987, " +
        "where it stayed at the top of the chart for five weeks and was the best-selling single of that year."
    };

    before(Helpers.connectTestingDb);
    before(Helpers.clearUsers);
    after(Helpers.disconnectDb);

    it("Should register the user and return it", function(done) {
        request(URL)
            .post("/register")
            .send(validUser)
            .end(function(err, res) {
                if (err) { throw err }
                var body = res.body;
                res.status.should.equal(Status.CREATED);

                should.exist(body.username);
                body.username.should.equal(validUser.username);

                should.exist(body.email);
                body.email.should.equal(validUser.email);

                should.exist(body.token);

                done();
            })
    });

    it("Should fail to register the user due to a username collision", function(done) {
        request(URL)
            .post("/register")
            .send(usernameCollision)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.COLLISION);
                done();
            })
    });

    it("Should fail to register the user due to an email collision", function(done) {
        request(URL)
            .post("/register")
            .send(emailCollision)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.COLLISION);
                done();
            })
    });

    it("Should fail to register the user due to a malformed username", function(done) {
        request(URL)
            .post("/register")
            .send(invalidUsername)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.USERNAME_MALFORMED);
                done();
            })
    });

    it("Should fail to register the user due to a malformed email address", function(done) {
        request(URL)
            .post("/register")
            .send(invalidEmail)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.EMAIL_MALFORMED);
                done();
            })
    });

    it("Should fail to register the user due to a too short password", function(done) {
        request(URL)
            .post("/register")
            .send(shortPassword)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.PASSWORD_MALFORMED);
                done();
            })
    });

    it("Should fail to register the user due to a too long password", function(done) {
        request(URL)
            .post("/register")
            .send(longPassword)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.PASSWORD_MALFORMED);
                done();
            })
    });

    it("Should fail to register the user due to no password", function(done) {
        request(URL)
            .post("/register")
            .send({
                username: validUser.username,
                email: validUser.email
            })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it("Should successfully login using username", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: validUser.username.toUpperCase() + "   ", //Check case-insensitivity and trimming of string
                password: validUser.password
            })
            .end(function(err, res) {
                if (err) { throw err }
                var body = res.body;
                res.status.should.equal(Status.OK);

                should.exist(body.username);
                body.username.should.equal(validUser.username);

                should.exist(body.email);
                body.email.should.equal(validUser.email);

                should.exist(body.token);

                done();
            })
    });

    it("Should successfully login using e-mail", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: validUser.email.toUpperCase() + "   ", //Check case-insensitivity and trimming of string
                password: validUser.password
            })
            .end(function(err, res) {
                if (err) { throw err }
                var body = res.body;
                res.status.should.equal(Status.OK);

                should.exist(body.username);
                body.username.should.equal(validUser.username);

                should.exist(body.email);
                body.email.should.equal(validUser.email);

                should.exist(body.token);

                done();
            })
    });

    it("Should fail to login with username due to wrong password", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: validUser.username.toUpperCase() + "   ", //Check case-insensitivity and trimming of string
                password: validUser.password + "123"
            })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.LOGIN_INVALID);
                done();
            })
    });


    it("Should fail to login with e-mail due to wrong password", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: validUser.email.toUpperCase() + "   ", //Check case-insensitivity and trimming of string
                password: validUser.password + "123"
            })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.LOGIN_INVALID);
                done();
            })
    });

    it("Should fail to login to non-registered user", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: "notregistered", //Check case-insensitivity and trimming of string
                password: validUser.password
            })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.NOT_FOUND);
                done();
            })
    });

    it("Should fail to login due to missing password", function(done) {
        request(URL)
            .post("/login")
            .send({
                user: validUser.username
            })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

});