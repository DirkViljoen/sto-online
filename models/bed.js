'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BedSchema   = new Schema({
    name: String,
    column: Number,
    row: Number,

    doctor: { type : mongoose.Schema.ObjectId, ref : 'doctors' },
    patient: String,

    doctorTimeIn: String,
    doctorDuration: Number,
    doctorDone: Boolean,
    doctorStart: Boolean,
    therapistTimeIn: String,
    therapistDuration: Number,
    therapistDone: Boolean,
    therapistStart: Boolean,
    sisterTimeIn: String,
    sisterDuration: Number,
    sisterDone: Boolean,
    sisterStart: Boolean

});

module.exports = mongoose.model('bed', BedSchema);
