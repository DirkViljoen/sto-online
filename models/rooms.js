'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
// var doctormodel = require('../models/doctor');

var RoomSchema   = new Schema({
    name: String,
    multipleBeds: Boolean,
    column: Number,
    row: Number,

    therapists: [{ type : mongoose.Schema.ObjectId, ref : 'therapists' }],
    beds: [{ type : mongoose.Schema.ObjectId, ref : 'beds' }],

    // moved to bed
    // doctor: { type : mongoose.Schema.ObjectId, ref : 'doctors' },
    // patient: String,

    // outdated
    // group: String,
    // therapist: { type : mongoose.Schema.ObjectId, ref : 'therapists' }

});

module.exports = mongoose.model('room', RoomSchema);
