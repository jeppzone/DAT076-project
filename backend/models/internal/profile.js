/**
 * Created by Oskar Jönefors on 2017-02-28.
 */

var Cfg = require('../../configuration');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ProfileSchema = new mongoose.Schema({
    owner: { type: ObjectId, ref: 'User', required: true, unique: true, index: true },
    text: { type: String, maxlength: Cfg.PROFILE_MAX_LENGTH, required: true, default: Cfg.PROFILE_DEFAULT_TEXT },
    lastActivity: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);