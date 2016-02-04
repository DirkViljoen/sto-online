'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DoctorSchema   = new Schema({
    name: String,
    colour: String
});

module.exports = mongoose.model('doctor', DoctorSchema);
