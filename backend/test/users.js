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

var UsersMW = require('../middleware/users');
var Profiles = require('../middleware/profiles');
var Tokens = require('../middleware/tokens');

describe("Get users", function() {

    const BASE_URL = "http://localhost:3000";
    const URL = "http://localhost:3000/users";

    const validUser = {
        username: "The Valid User",
        email: "valid@user.com",
        password: "hunter2"
    };

    const validUser2 = {
        username: "EquallyValidUser2",
        email: "valid2@user.com",
        password: "hunter2"
    };

    const validProfileText = "Welcome to my awesome profile!";
    const tooLongProfileText = new Array(4000).join("X");

    var userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNThiNzIyNWQyN2VjNGYzNDE5MGU1NTZjIiwiaWF0IjoxNDg4Mzk2ODkzLCJleHAiOjE0OTA5ODg4OTN9.dTVwasHRFu_hmyY569zqPHOEcGvuSdneYeLcMK_0Qi8";
    var user2Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNThiNzIyNWQyN2VjNGYzNDE5MGU1NTZlIiwiaWF0IjoxNDg4Mzk2ODkzLCJleHAiOjE0OTA5ODg4OTN9.HkCA8b93oDdarkHJ3oeQayY1czxGdDp0cNWnnUW0uYM";

    before(Helpers.connectTestingDb);

    before(Helpers.clearUsers);
    before(Helpers.clearProfiles);
    before(function (done) {
        UsersMW.register(validUser)
            .then(function (registeredUser) {
                userToken = Tokens.signSessionToken(registeredUser);
                return Profiles.createProfile(registeredUser._id)
                    .then(function() { done() });
            })
    });

    before(function (done) {
        UsersMW.register(validUser2)
            .then(function (registeredUser2) {
                user2Token = Tokens.signSessionToken(registeredUser2);
                return Profiles.createProfile(registeredUser2._id)
                    .then(function() { done() });
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
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }

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
            .expect(Status.NOT_FOUND)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    const MY_PROFILE_URL = 'http://localhost:3000/profile';

    it('Should return the user profile', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .set('authorization', userToken)
            .send()
            .expect(Status.OK)
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
            .expect(Status.OK)
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
            .expect(Errors.BAD_REQUEST)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should receive error due to invalid token', function(done) {
        request(MY_PROFILE_URL)
            .get('/')
            .set('authorization', 'this is not really a token')
            .send()
            .expect(Errors.TOKEN_INVALID)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should return the other user profile', function(done) {
        request(URL)
            .get('/' + encodeURIComponent(validUser.username) + '/profile')
            .send()
            .expect(Status.OK)
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
            .expect(Errors.NOT_FOUND)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should update the profile of the given user', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', userToken)
            .send({text: validProfileText})
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
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
            .expect(Errors.VALIDATION_ERROR)
            .end(function (err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should fail to update the profile due to missing text attribute', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', userToken)
            .send({texxxxt: validProfileText})
            .expect(Errors.VALIDATION_ERROR)
            .end(function (err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should fail to update the profile due to missing token', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .send({text: validProfileText})
            .expect(Errors.VALIDATION_ERROR)
            .end(function (err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should fail to update the profile due to invalid token', function(done) {
        request(MY_PROFILE_URL)
            .put('/')
            .set('authorization', 'LET ME IN PLZ')
            .send({text: validProfileText})
            .expect(Errors.TOKEN_INVALID)
            .end(function (err, res) {
                if (err) { throw err }
                res.status.should.equal(Errors.TOKEN_INVALID);
                done();
            })
    });

    it('Should find user when searching ', function(done) {
        request(URL)
            .get('/?search=equ')
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                should.exist(res.body);

                var body = res.body;

                should.exist(body.users);
                var results = body.users;

                results.length.should.equal(1);

                var fstRes = results[0];

                should.exist(fstRes.username);
                fstRes.username.should.equal(validUser2.username);
                done();
            })
    });

    it('Should find user when searching ', function(done) {
        request(URL)
            .get('/?search=the')
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                should.exist(res.body);

                var body = res.body;

                should.exist(body.users);
                var results = body.users;

                results.length.should.equal(1);

                var fstRes = results[0];

                should.exist(fstRes.username);
                fstRes.username.should.equal(validUser.username);
                done();
            })
    });

    it('Should find no user when searching ', function(done) {
        request(URL)
            .get('/?search=haaaaaa')
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                should.exist(res.body);

                var body = res.body;

                should.exist(body.users);
                var results = body.users;

                results.length.should.equal(0);
                done();
            })
    });

    it('Should fail to search with short string', function(done) {
        request(URL)
            .get('/?search=h')
            .send()
            .expect(Errors.BAD_REQUEST)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should be able to follow user', function(done) {
        request(BASE_URL)
            .put('/following?user=' + encodeURIComponent(validUser2.username))
            .set('authorization', userToken)
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should be able to see who you are following', function(done) {
        request(BASE_URL)
            .get('/following')
            .set('authorization', userToken)
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                var body = res.body;
                should.exist(body.following);
                body.following.length.should.equal(1);
                var fstFollow = body.following[0];

                fstFollow.username.should.equal(validUser2.username);
                done();
            })
    });

    it('Should be able to unfollow user', function(done) {
        request(BASE_URL)
            .delete('/following?user=' + encodeURIComponent(validUser2.username))
            .set('authorization', userToken)
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should not be able to follow yourself', function(done) {
        request(BASE_URL)
            .put('/following?user=' + encodeURIComponent(validUser.username))
            .set('authorization', userToken)
            .send()
            .expect(Errors.FORBIDDEN)
            .end(function(err, res) {
                if (err) { throw err }
                done();
            })
    });

    it('Should be able to see listing of all users', function(done) {
        request(URL)
            .get('/')
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                should.exist(res.body);
                var body = res.body;
                should.exist (body.users);
                body.users.length.should.equal(2);
                done();
            })
    });

    it('Should be able to see listing of all users', function(done) {
        request(URL)
            .get('/')
            .set('authorization', userToken)
            .send()
            .expect(Status.OK)
            .end(function(err, res) {
                if (err) { throw err }
                should.exist(res.body);
                var body = res.body;
                should.exist (body.users);
                body.users.length.should.equal(1);

                var userOmitted = body.users.every(function(u) {
                    return u.username !== validUser.username;
                });

                userOmitted.should.equal(true);

                done();
            })
    })

});
