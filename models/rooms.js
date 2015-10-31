'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var doctormodel = require('../models/docter');

var RoomSchema   = new Schema({
    name: String,
    group: String,
    docter: { type : mongoose.Schema.ObjectId, ref : 'docters' },
    docterTimeIn: String,
    docterDone: Boolean,
    docterStart: Boolean,
    therapist: { type : mongoose.Schema.ObjectId, ref : 'therapists' },
    therapistTimeIn: String,
    therapistDone: Boolean,
    therapistStart: Boolean,
    sisterTimeIn: String,
    sisterDone: Boolean,
    sisterStart: Boolean,
    patient: String
});

module.exports = mongoose.model('room', RoomSchema);
