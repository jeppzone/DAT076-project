/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
    usernameLower: { // Lowercase representation of username for efficient searching
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        match: /^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð _,.'-]{3,50}$/,
        index: true,
        unique: true
    },
    username: { // Cased representaiton of username for presentation
        type: String,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        unique: true,
        sparse: true,
        lowercase: true
    },
    password: String
});

UserSchema.pre('save', function(next) {
    var user = this;

    // Only hash the password if it has changed
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password with the generated salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // Replace cleartext password with hash
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareAsync(candidatePassword, this.password)
};

module.exports = mongoose.model('User', UserSchema);