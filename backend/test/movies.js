/**
 * Created by Oskar Jönefors on 2/26/17.
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

describe("Post and read reviews", function() {

    const URL = "http://localhost:3000/movies";

    const validUser = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "hunter2"
    };

    const validUser2 = {
        username: "The Valid User2",
        email: "valid2@user.com",
        password: "hunter2"
    };

    const validReview = {
        score: 5,
        text: "I really enjoyed this movie!"
    };

    const validReview2 = {
        score: 1,
        text: "What a steaming load of crap this movie was!"
    };

    var userToken;
    var user2Token;

    before(Helpers.connectTestingDb);
    before(Helpers.clearUsers);
    before(Helpers.clearReviews);
    before(function(done) {
        UsersMW.register(validUser)
            .then(function(pubUser) {
                userToken = pubUser.token;
                done();
            })
    });

    before(function(done) {
        UsersMW.register(validUser2)
            .then(function(pubUser) {
                user2Token = pubUser.token;
                done();
            })
    });

    after(Helpers.disconnectDb);

    it('Should not be able to post a review without a token', function(done) {
        request(URL)
            .post("/329865/review")
            .send(validReview)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.TOKEN_INVALID);
                done();
            })
    });


    it('Should not be able to post a review without score or text', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', userToken)
            .send({})
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should not be able to post a review with an invalid score', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', userToken)
            .send({score: 6})
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should not be able to post a review with an invalid score', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', userToken)
            .send({score: "hello"})
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should not be able to post a review to a movie with an invalid id', function(done) {
        request(URL)
            .post("/greatmovie/review")
            .set('authorization', userToken)
            .send({score: 5})
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should not be able to post a review that is too long', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', userToken)
            .send({score: 5, text: new Array(4000).join("X") })
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.BAD_REQUEST);
                done();
            })
    });

    it('Should be able to post a review', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', userToken)
            .send(validReview)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Status.CREATED);

                var body = res.body;

                should.exist(body.score);
                body.score.should.equal(validReview.score);

                should.exist(body.text);
                body.text.should.equal(validReview.text);

                should.exist(body.date);

                should.exist(body.author);
                should.exist(body.author.id);
                should.exist(body.author.username);
                body.author.username.should.equal(validUser.username);

                done();
            })
    });

    it('Should be able to post a review', function(done) {
        request(URL)
            .post("/329865/review")
            .set('authorization', user2Token)
            .send(validReview2)
            .end(function(err, res) {
                if (err) { throw err }
                res.status.should.equal(Status.CREATED);

                var body = res.body;

                should.exist(body.score);
                body.score.should.equal(validReview2.score);

                should.exist(body.text);
                body.text.should.equal(validReview2.text);

                should.exist(body.date);

                should.exist(body.author);
                should.exist(body.author.id);
                should.exist(body.author.username);
                body.author.username.should.equal(validUser2.username);

                done();
            })
    });

    it('Should be able to get movie details', function(done) {
        request(URL)
            .get("/329865")
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                res.status.should.equal(Status.OK);
                var body = res.body;

                should.exist(body.averageScore);
                body.averageScore.should.equal((validReview.score + validReview2.score)/2.0);

                should.exist(body.reviews);
                body.reviews.length.should.equal(2);

                done();
            })
    });

    it('Should be able to get movie details', function(done) {
        request(URL)
            .get("/329866")
            .send()
            .end(function(err, res) {
                if (err) { throw err }

                res.status.should.equal(Status.OK);
                var body = res.body;

                should.exist(body.averageScore);
                body.averageScore.should.equal(0);

                should.exist(body.reviews);
                body.reviews.length.should.equal(0);

                done();
            })
    })

});