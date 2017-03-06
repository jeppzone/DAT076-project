/**
 * Created by Oskar Jönefors on 2/22/17.
 */

const MILLIS_PER_HOUR = 3600000;

module.exports = {
    DB_ADDRESS: "mongodb://localhost:27017/moviesite",
    DB_TESTING_ADDRESS: "mongodb://localhost:27017/moviesite-test",
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 50,
    TOKEN_SECRET: "it_would_be_bad_to_publish_this_in_a_public_repository",
    TOKEN_EXPIRATION_TIME: "30d",
    REVIEW_MAX_LENGTH: 3000,
    PROFILE_MAX_LENGTH: 3000,
    PROFILE_DEFAULT_TEXT: "The user has not written a profile text yet.",
    MAX_SCORE: 5,
    NBR_REVIEWS_MOVIE_INFO: 10,
    MOVIE_REFRESH_HOURS: 24, // If a movie has been fetched from TMDB in this time period, do not fetch again to update it.
    MOVIE_REFRESH_MILLIS: this.MOVIE_REFRESH_HOURS * MILLIS_PER_HOUR,
    LATEST_REVIEWS_MAX_LIMIT: 20,
    SEARCH_MIN_LENGTH: 3,

    MOVIE_LIST_MAX_LENGTH: 500,
    MOVIE_LIST_DESCRIPTION_MAX_LENGTH: 3000,
    MOVIE_LIST_TITLE_MIN_LENGTH: 3,
    MOVIE_LIST_TITLE_MAX_LENGTH: 140
};