'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TherapistSchema   = new Schema({
    name: String,
    colour: String
});

module.exports = mongoose.model('therapist', TherapistSchema);
