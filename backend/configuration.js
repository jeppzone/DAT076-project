/**
 * Created by Oskar Jönefors on 2/22/17.
 */

module.exports = {
    DB_ADDRESS: 'mongodb://localhost:27017/moviesite',
    DB_TESTING_ADDRESS: 'mongodb://localhost:27017/moviesite-test',
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 50,
    TOKEN_SECRET: 'it_would_be_bad_to_publish_this_in_a_public_repository',
    TOKEN_EXPIRATION_TIME: '30d'
};