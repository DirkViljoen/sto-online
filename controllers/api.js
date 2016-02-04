'use strict';

var db          = require('../lib/db-mongo'),
    mongoose    = require('mongoose'),
    moment      = require('moment');

var
    doctormodel = require('../models/doctor'),
    therapistmodel = require('../models/therapist'),
    roommodel = require('../models/rooms'),
    bedmodel = require('../models/bed');

var
    defualtDuration = 5;

module.exports = function (router) {

    router.get('/', function (req, res) {
        console.log("Cookies: ", req.cookies);
        res.send('<code><pre>' + JSON.stringify({location: "/api/"}, null, 2) + '</pre></code>');
    });

    // Doctors

        router.get('/doctors', function(req, res) {
            doctormodel.find(function(err, doctors) {
                if (err)
                    res.send(err);

                res.send(doctors);
            });
         });

        router.get('/doctors/:id', function(req, res) {
            doctormodel.findById(req.params.id, function(err, dokter) {
                if (err)
                    res.send(err);
                res.send(doctor);
            });
         });

        router.post('/doctors', function(req, res) {
            var doc = new doctormodel();
            doc.name = req.body.name;
            doc.colour = req.body.colour;

            // save the doctor and check for errors
            doc.save(function(err) {
                if (err){
                    res.send(err);
                }
                else
                {
                    res.json({ message: 'doctor created!' });
                }
            });
         });

        router.put('/doctors/:id', function(req, res) {
            doctormodel.findById(req.params.id, function(err, doc) {
                if (err){
                    res.send(err);
                }
                else
                {
                    console.log(doc);
                    doc.name = req.body.name;
                    doc.colour = req.body.colour;
                    // save the bear
                    doc.save(function(err) {
                        if (err)
                            res.send(err);

                        res.json({ message: 'doctor updated!' });
                    });
                }
            });
         });

        router.delete('/doctors/:id', function(req, res) {
            doctormodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err)
                    res.send(err);

                res.json({ message: 'doctor successfully deleted' });
            });
         });

    // Therapists

        router.get('/therapists', function(req, res) {
            therapistmodel.find(function(err, therapists) {
                if (err)
                    res.send(err);

                res.send(therapists);
            });
         });

        router.get('/therapists/:id', function(req, res) {
            therapistmodel.findById(req.params.id, function(err, therapist) {
                if (err)
                    res.send(err);
                res.send(therapist);
            });
         });

        router.post('/therapists', function(req, res) {
            var ther = new therapistmodel();
            ther.name = req.body.name;
            ther.colour = req.body.colour;

            // save the therapist and check for errors
            ther.save(function(err) {
                if (err){
                    res.send(err);
                }
                else{
                    res.json({ message: 'Therapist created!' });
                }
            });
         });

        router.put('/therapists/:id', function(req, res) {
            therapistmodel.findById(req.params.id, function(err, ther) {

                if (err)
                    res.send(err);

                ther.name = req.body.name;
                ther.colour = req.body.colour;

                ther.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Therapist updated!' });
                });

            });
         });

        router.delete('/therapists/:id', function(req, res) {
            therapistmodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err)
                    res.send(err);

                res.json({ message: 'Therapist successfully deleted' });
            });
         });

    // Rooms & Beds

        router.get('/rooms', function(req, res) {
            roommodel.find(function(err, rooms) {
                if (err)
                    res.send(err);

                res.send(rooms);
            });
         });

        router.get('/rooms/:id', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {
                if (err)
                    res.send(err);
                res.send(room);
            });
         });

        router.get('/rooms/:id/beds', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {
                if (err)
                    res.send(err);
                bedmodel.find(function(err, beds) {

                    if (err)
                        res.send(err);

                    var result = [];

                    if (beds.length == 0){
                        res.send(result);
                    }
                    else{
                        for (var k = 0; k < beds.length; k++){
                            // for (var i = 0; i < room.beds.length)
                            if (room.beds.indexOf(beds[k]._id) != -1){
                                result.push(beds[k]);
                            }
                            if (k == beds.length - 1){
                                res.send(result);
                            }
                        }
                    }
                });
            });
         });

        router.get('/rooms/:rid/beds/:bid', function(req, res) {
            bedmodel.findById(req.params.bid, function(err, bed) {
                if (err)
                    res.send(err);
                res.send(bed);
            });
         });

        router.post('/rooms', function(req, res) {
            var room = new roommodel();
            room.name = req.body.name;
            room.multipleBeds = req.body.multipleBeds ? req.body.multipleBeds : false;
            room.column = req.body.column ? req.body.column : 0;
            room.row = req.body.row ? req.body.row : 0;

            // save the Room and check for errors
            room.save(function(err, newRoom) {
                if (err){
                    res.send(err);
                }
                else{
                    res.send(newRoom);
                }
            });
         });

        router.post('/rooms/:id/beds', function(req, res) {
            var bed = new bedmodel();
            bed.name = req.body.name ? req.body.name : 'Bed';
            bed.column = req.body.column ? req.body.column : 0;
            bed.row = req.body.row ? req.body.row : 0;

            // save the Bed and check for errors
            bed.save(function(err, nBed) {
                if (err){
                    res.send(err);
                }
                else{
                    roommodel.findById(req.params.id, function(err, room) {
                        if (err)
                            res.send(err);

                        room.beds.push(nBed._id);

                        room.save(function(err) {
                            if (err)
                                res.send(err);

                            res.json({ message: 'Bed Created, Room updated!' });
                        });
                    })
                }
            });
         });

        router.put('/rooms/:id', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {
                console.log(room);
                if (err)
                    res.send(err);

                room.name = req.body.name ? req.body.name : room.name;
                if (!(req.body.multipleBeds === undefined)){
                    room.multipleBeds = req.body.multipleBeds;
                }

                // room.multipleBeds = req.body.multipleBeds ? req.body.multipleBeds : room.multipleBeds;
                room.column = req.body.column ? req.body.column : room.column;
                room.row = req.body.row ? req.body.row : room.row;

                room.therapists = req.body.therapists ? req.body.therapists : room.therapists;

                // Note room updating is handled seperately
                // room.beds = req.body.beds ? req.body.beds : room.beds;

                room.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Room updated!' });
                });

            });
         });

        router.put('/rooms/:rid/beds/:bid', function(req, res) {
            console.log(req.body);
            bedmodel.findById(req.params.bid, function(err, bed) {
                console.log(bed);
                if (err)
                    res.send(err);

                bed.name = req.body.name ? req.body.name : bed.name;
                bed.column = req.body.column ? req.body.column : bed.column;
                bed.row = req.body.row ? req.body.row : bed.row;

                bed.doctor = req.body.doctor ? req.body.doctor : bed.doctor;
                bed.patient = req.body.patient ? req.body.patient : bed.patient;

                bed.doctorTimeIn = req.body.dtime ? req.body.dtime : null;
                bed.doctorDuration = req.body.doctorDuration ? req.body.doctorDuration : defualtDuration;
                bed.doctorStart = req.body.doctorStart ? req.body.doctorStart : false;
                bed.doctorDone = req.body.doctorDone ? req.body.doctorDone : false;

                bed.therapistTimeIn = req.body.ttime ? req.body.ttime : null;
                bed.therapistDuration = req.body.therapistDuration ? req.body.therapistDuration : defualtDuration;
                bed.therapistStart = req.body.therapistStart ? req.body.therapistStart : false;
                bed.therapistDone = req.body.therapistDone ? req.body.therapistDone : false;

                bed.sisterTimeIn = req.body.stime ? req.body.stime : null;
                bed.sisterDuration = req.body.sisterDuration ? req.body.sisterDuration : defualtDuration;
                bed.sisterStart = req.body.sisterStart ? req.body.sisterStart : false;
                bed.sisterDone = req.body.sisterDone ? req.body.sisterDone : false;

                bed.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Bed updated!' });
                });

            });
         });

        router.patch('/rooms/:rid/beds/:bid/:action', function(req, res) {
            bedmodel.findById(req.params.bid, function(err, room) {

                if (err)
                    res.send(err);

                var msg = '';

                console.log(req.body);

                switch(req.params.action) {
                    case 'dstart':
                        bed.doctorTimeIn = moment();
                        bed.doctorDuration = req.body.doctorDuration ? req.body.doctorDuration : defualtDuration;
                        bed.doctorStart = true;
                        bed.doctorDone = false;
                        msg = 'doctor started.';
                        break;
                    case 'dstop':
                        bed.doctorDone = true;
                        msg = 'doctor stopped';
                        break;
                    case 'dreset':
                        bed.doctorStart = false;
                        bed.doctorDone = false;
                        msg = 'doctor reset';
                        break;
                    case 'tstart':
                        bed.therapistTimeIn = moment();
                        bed.therapistDuration = req.body.therapistDuration ? req.body.therapistDuration : defualtDuration;
                        bed.therapistStart = true;
                        bed.therapistDone = false;
                        msg = 'therapist started';
                        break;
                    case 'tstop':
                        bed.therapistDone = true;
                        msg = 'therapist stopped';
                        break;
                    case 'treset':
                        bed.therapistStart = false;
                        bed.therapistDone = false;
                        msg = 'therapist reset';
                        break;
                    case 'sstart':
                        bed.sisterTimeIn = moment();
                        bed.sisterDuration = req.body.sisterDuration ? req.body.sisterDuration : defualtDuration;
                        bed.sisterStart = true;
                        bed.sisterDone = false;
                        msg = 'sister started';
                        break;
                    case 'sstop':
                        bed.sisterDone = true;
                        msg = 'sister stopped';
                        break;
                    case 'sreset':
                        bed.sisterStart = false;
                        bed.sisterDone = false;
                        msg = 'sister reset';
                        break;
                    case 'resetAll':
                        bed.doctorStart = false;
                        bed.doctorDone = false;
                        bed.therapistStart = false;
                        bed.therapistDone = false;
                        bed.sisterStart = false;
                        bed.sisterDone = false;
                        bed.doctor = null;
                        // room.doctorTimeIn = req.body.dtime;
                        // room.doctorStart = req.body.doctorStart;
                        // room.doctorDone = req.body.doctorDone;
                        // bed.therapist = null;
                        // room.therapistTimeIn = req.body.ttime;
                        // room.therapistStart = req.body.therapistStart;
                        // room.therapistDone = req.body.therapistDone;
                        // room.sisterTimeIn = req.body.stime
                        // room.sisterStart = req.body.sisterStart;
                        // room.sisterDone = req.body.sisterDone;
                        bed.patient = "";
                        msg = 'All reset';
                        break;
                    default:
                        msg = 'unknown action';
                }



                bed.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: msg });
                });

            });
         });

        router.delete('/rooms/:id', function(req, res) {
            roommodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err)
                    res.send(err);

                console.log('##DELETE Room', req.params.rid);
                res.json({ message: 'Room successfully deleted' });
            });
         });

        router.delete('/rooms/:rid/beds/:bid', function(req, res) {
            roommodel.findById(req.params.rid, function(err, room) {
                if (err)
                    res.send(err);
                room.beds.splice(room.beds.indexOf(req.params.bid),1);

                room.save(function(err) {
                    if (err)
                        res.send(err);

                    console.log('##UPDATE Room', req.params.rid);
                });
            })

            bedmodel.remove({
                _id: req.params.bid
            }, function(err, doc) {
                if (err)
                    res.send(err);

                console.log('##DELETE Bed', req.params.bid);
                res.json({ message: 'Bed successfully deleted' });
            });
         });

};
