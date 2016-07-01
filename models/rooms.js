'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
// var doctormodel = require('../models/doctor');

var RoomSchema   = new Schema({
    name: String,
    multipleBeds: Number,
    bedsView: Number,
    column: Number,
    row: Number,

    therapists: [{ type : mongoose.Schema.ObjectId, ref : 'therapists' }],
    beds: [{ type : mongoose.Schema.ObjectId, ref : 'beds' }],

    // Settings
    resetTherapists: Number,
    resetDoctors: Number,
    resetPatients: Number,

    dTimerType: String,
    dTrackTime: Number,
    tTimerType: String,
    tTrackTime: Number,
    sTimerType: String,
    sTrackTime: Number,

    dEnabled: Number,
    dShow: Number,
    tEnabled: Number,
    tShow: Number,
    sEnabled: Number,
    sShow: Number

    // moved to bed
    // doctor: { type : mongoose.Schema.ObjectId, ref : 'doctors' },
    // patient: String,

    // outdated
    // group: String,
    // therapist: { type : mongoose.Schema.ObjectId, ref : 'therapists' }

});

module.exports = mongoose.model('room', RoomSchema);
