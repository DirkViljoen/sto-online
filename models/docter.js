'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DocterSchema   = new Schema({
    name: String,
    colour: String
});

module.exports = mongoose.model('docter', DocterSchema);
