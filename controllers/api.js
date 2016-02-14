'use strict';

var db          = require('../lib/db-mongo'),
    mongoose    = require('mongoose'),
    moment      = require('moment'),
    colors      = require('colors');

var
    doctormodel = require('../models/doctor'),
    therapistmodel = require('../models/therapist'),
    roommodel = require('../models/rooms'),
    bedmodel = require('../models/bed');

var
    defualtDuration = 20;

module.exports = function (router) {

    router.get('/', function (req, res) {
        console.log("Cookies: ", req.cookies);
        res.send('<code><pre>' + JSON.stringify({location: "/api/"}, null, 2) + '</pre></code>');
    });

    // Doctors

        router.get('/doctors', function(req, res) {
            doctormodel.find(function(err, doctors){
                if (err){
                    console.error('ERROR -'.red , 'GET api/doctors - find'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(doctors);
                }
            }).sort({'name':1});
         });

        router.get('/doctors/:id', function(req, res) {
            doctormodel.findById(req.params.id, function(err, doctor) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/octors/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(doctor);
                }
            });
         });

        router.post('/doctors', function(req, res) {
            var doc = new doctormodel();
            doc.name = req.body.name;
            doc.colour = req.body.colour;

            // save the doctor and check for errors
            doc.save(function(err) {
                if (err){
                    console.error('ERROR -'.red , 'POST api/doctors - save'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else
                {
                    res.send({'error':false});
                }
            });
         });

        router.put('/doctors/:id', function(req, res) {
            doctormodel.findById(req.params.id, function(err, doc) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/doctors/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else
                {
                    doc.name = req.body.name;
                    doc.colour = req.body.colour;
                    // save the bear
                    doc.save(function(err) {
                        if (err){
                            console.error('ERROR -'.red , 'PUT api/doctors/:id - save'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            res.send({'error':false});
                        }
                    });
                }
            });
         });

        router.delete('/doctors/:id', function(req, res) {
            doctormodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err){
                    console.error('ERROR -'.red , 'DELETE api/doctors/:id - remove'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send({'error':false});
                }
            });
         });

    // Therapists

        router.get('/therapists', function(req, res) {
            therapistmodel.find(function(err, therapists) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/therapists - find'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(therapists);
                }
            }).sort({'name':1});
         });

        router.get('/therapists/:id', function(req, res) {
            therapistmodel.findById(req.params.id, function(err, therapist) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/therapists/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(therapist);
                }
            });
         });

        router.post('/therapists', function(req, res) {
            var ther = new therapistmodel();
            ther.name = req.body.name;
            ther.colour = req.body.colour;

            // save the therapist and check for errors
            ther.save(function(err) {
                if (err){
                    console.error('ERROR -'.red , 'POST api/therapists - save'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send({'error':false});
                }
            });
         });

        router.put('/therapists/:id', function(req, res) {
            therapistmodel.findById(req.params.id, function(err, ther) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/therapists/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    ther.name = req.body.name;
                    ther.colour = req.body.colour;

                    ther.save(function(err) {
                        if (err){
                            console.error('ERROR -'.red , 'PUT api/therapists/:id - save'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            res.send({'error':false});
                        }
                    });
                }

            });
         });

        router.delete('/therapists/:id', function(req, res) {
            therapistmodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err){
                    console.error('ERROR -'.red , 'DELETE api/therapists/:id - remove'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send({'error':false});
                }
            });
         });

    // Rooms & Beds

        router.get('/rooms', function(req, res) {
            roommodel.find(function(err, rooms) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/rooms - find'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(rooms);
                }
            });
         });

        router.get('/rooms/:id', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/rooms/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(room);
                }

            });
         });

        router.get('/beds', function(req, res) {
            bedmodel.find(function(err, beds) {
                if (err){
                    console.error('ERROR -'.red , 'GET api/beds'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(beds);
                }

            });
         });

        router.get('/rooms/:id/beds', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/rooms/:id/beds - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    bedmodel.find(function(err, beds) {
                        if (err){
                            console.error('ERROR -'.red , 'PUT api/room/:id/beds - find'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
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
                        }
                    });
                }
            });
         });

        router.get('/rooms/:rid/beds/:bid', function(req, res) {
            bedmodel.findById(req.params.bid, function(err, bed) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/rooms/:rid/beds/:bid - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send(bed);
                }
            });
         });

        router.post('/rooms', function(req, res) {
            var room = new roommodel();
            room.name = req.body.name;
            room.multipleBeds = req.body.multipleBeds ? req.body.multipleBeds : 0;
            room.bedsView = req.body.bedsView ? req.body.bedsView : 1;
            room.column = req.body.column ? req.body.column : 1;
            room.row = req.body.row ? req.body.row : 1;

            room.resetTherapists = req.body.resetTherapists ? req.body.resetTherapists : 1;
            room.resetDoctors = req.body.resetDoctors ? req.body.resetDoctors : 1;
            room.resetPatients = req.body.resetPatients ? req.body.resetPatients : 1;

            room.dTimerType = req.body.dTimerType ? req.body.dTimerType : 'SSR';
            room.dTrackTime = req.body.dTrackTime ? req.body.dTrackTime : 1;

            room.tTimerType = req.body.tTimerType ? req.body.tTimerType : 'SSR';
            room.tTrackTime = req.body.tTrackTime ? req.body.tTrackTime : 1;

            room.sTimerType = req.body.sTimerType ? req.body.sTimerType : 'DR';
            room.sTrackTime = req.body.sTrackTime ? req.body.sTrackTime : 0;

            // save the Room and check for errors
            room.save(function(err, newRoom) {
                if (err){
                    console.error('ERROR -'.red, 'POST api/rooms - save'.yellow, err.message);
                    res.send({'error':true, 'message':err});
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
                    console.error('ERROR -'.red , 'POST api/rooms/id/beds - save bed'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    roommodel.findById(req.params.id, function(err, room) {
                        if (err){
                            console.error('ERROR -'.red , 'POST api/rooms/:id/beds - findById room'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            room.beds.push(nBed._id);

                            room.save(function(err) {
                                if (err){
                                    console.error('ERROR -'.red , 'POST api/rooms/:id/beds - save room'.yellow, err.message);
                                    res.send({'error':true, 'message':err});
                                }
                                else{
                                    res.send({'error':false});
                                }
                            });
                        }
                    })
                }
            });
         });

        router.put('/rooms/:id', function(req, res) {
            // console.log('info'.green,req.body);
            roommodel.findById(req.params.id, function(err, room) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/rooms/:id - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    room.name = req.body.name ? req.body.name : room.name;

                    if (!(req.body.multipleBeds === undefined)){
                        room.multipleBeds = req.body.multipleBeds;
                    }
                    else{
                        room.multipleBeds = 0;
                    }

                    // room.bedsView = req.body.bedsView ? req.body.bedsView : 1;
                    if (!(req.body.bedsView === undefined)){
                        room.bedsView = req.body.bedsView;
                    }
                    else{
                        room.bedsView = 1;
                    }

                    // room.resetTherapists = req.body.resetTherapists ? req.body.resetTherapists : 1;
                    if (!(req.body.resetTherapists === undefined)){
                        room.resetTherapists = req.body.resetTherapists;
                    }
                    else{
                        room.resetTherapists = 1;
                    }

                    // room.resetDoctors = req.body.resetDoctors ? req.body.resetDoctors : 1;
                    if (!(req.body.resetDoctors === undefined)){
                        room.resetDoctors = req.body.resetDoctors;
                    }
                    else{
                        room.resetDoctors = 1;
                    }

                    // room.resetPatients = req.body.resetPatients ? req.body.resetPatients : 1;
                    if (!(req.body.resetPatients === undefined)){
                        room.resetPatients = req.body.resetPatients;
                    }
                    else{
                        room.resetPatients = 1;
                    }

                    room.dTimerType = req.body.dTimerType ? req.body.dTimerType : 'SSR';
                    // room.dTrackTime = req.body.dTrackTime ? req.body.dTrackTime : 1;
                    if (!(req.body.dTrackTime === undefined)){
                        room.dTrackTime = req.body.dTrackTime;
                    }
                    else{
                        room.dTrackTime = 1;
                    }

                    room.tTimerType = req.body.tTimerType ? req.body.tTimerType : 'SSR';
                    // room.tTrackTime = req.body.tTrackTime ? req.body.tTrackTime : 1;
                    if (!(req.body.tTrackTime === undefined)){
                        room.tTrackTime = req.body.tTrackTime;
                    }
                    else{
                        room.tTrackTime = 1;
                    }

                    room.sTimerType = req.body.sTimerType ? req.body.sTimerType : 'DR';
                    // room.sTrackTime = req.body.sTrackTime ? req.body.sTrackTime : 1;
                    if (!(req.body.sTrackTime === undefined)){
                        room.sTrackTime = req.body.sTrackTime;
                    }
                    else{
                        room.sTrackTime = 0;
                    }

                    room.column = req.body.column ? req.body.column : room.column;
                    room.row = req.body.row ? req.body.row : room.row;

                    if(req.body.therapists.length > 0){
                        room.therapists = [];
                        for (var i = 0;i < req.body.therapists.length;i++){
                            if (!req.body.therapists[i] == ''){
                                room.therapists.push(req.body.therapists[i])
                            }
                        }
                    }

                    // Note room updating is handled seperately
                    // room.beds = req.body.beds ? req.body.beds : room.beds;

                    // console.log('info'.green,room);

                    room.save(function(err) {
                        if (err){
                            console.error('ERROR -'.red , 'PUT api/rooms/:id - save'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            res.send({'error': false});
                        }
                    });
                }
            });
         });

        router.put('/rooms/:rid/beds/:bid', function(req, res) {
            console.log('info'.green,req.body);
            bedmodel.findById(req.params.bid, function(err, bed) {
                if (err){
                    console.error('ERROR -'.red , 'PUT api/rooms/:rid/beds/:bid - findById'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    bed.name = req.body.name ? req.body.name : bed.name;
                    bed.column = req.body.column ? req.body.column : bed.column;
                    bed.row = req.body.row ? req.body.row : bed.row;

                    if (req.body.doctor){
                        // console.log('info'.green,'Doctor id provided');
                        bed.doctor = req.body.doctor;
                    }
                    else{
                        // console.log('info'.green,'Doctor id not provided');
                        if (!bed.doctor){
                            bed.doctor = '000000000000000000000000';
                        }
                    }

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
                        if (err){
                            console.error('ERROR -'.red , 'PUT api/rooms/:rid/beds/:bid - save'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            res.send({'error':false});
                        }
                    });
                }
            });
         });

        router.patch('/rooms/:rid/beds/:bid/:action', function(req, res) {
            var localsave = false;
            console.log('info'.green, req.body.beds[0]);

            bedmodel.findById(req.params.bid, function(err, bed) {
                if (err){
                    console.error('ERROR -'.red , 'PATCH api/rooms/:rid/beds/:bid/:action - findById bed'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    var msg = '';

                    switch(req.params.action) {
                        case 'dstart':
                            bed.doctorTimeIn = moment();
                            bed.doctorDuration = req.body.beds[0].doctorDuration ? req.body.beds[0].doctorDuration : defualtDuration;
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
                            bed.therapistDuration = req.body.beds[0].therapistDuration ? req.body.beds[0].therapistDuration : defualtDuration;
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
                            localsave = true;
                            bed.doctorStart = false;
                            bed.doctorDone = false;
                            bed.therapistStart = false;
                            bed.therapistDone = false;
                            bed.sisterStart = false;
                            bed.sisterDone = false;

                            roommodel.findById(req.params.rid,function(err,room) {
                                if (err){
                                    console.error('ERROR -'.red , 'PATCH api/rooms/:rid/beds/:bid/:action - findById room'.yellow, err.message);
                                    // res.send({'error':true, 'message':err});
                                }
                                else{
                                    if (room.resetDoctors==1){
                                        bed.doctor = '000000000000000000000000';
                                    }
                                    if (room.resetPatients==1){
                                        bed.patient = "";
                                    }
                                    if (room.resetTherapists==1){
                                        room.therapists=[];
                                        room.save(function(err) {
                                            if (err){
                                                console.error('ERROR -'.red , 'PATCH api/rooms/:rid/beds/:bid/:action - save room'.yellow, err.message);
                                            }
                                        });
                                        bed.save(function(err) {
                                            if (err){
                                                console.error('ERROR -'.red , 'PATCH api/rooms/:rid/beds/:bid/:action - save bed'.yellow, err.message);
                                                res.send({'error':true, 'message':err});
                                            }
                                            else{
                                                res.send({'error':false});
                                            }
                                        });
                                    }
                                }
                            });
                            msg = 'All reset';
                            break;
                        default:
                            msg = 'unknown action';
                    }

                    if (!localsave){
                        bed.save(function(err) {
                            if (err){
                                console.error('ERROR -'.red , 'PATCH api/rooms/:rid/beds/:bid/:action - save bed'.yellow, err.message);
                                res.send({'error':true, 'message':err});
                            }
                            else{
                                res.send({'error':false});
                            }
                        });
                    }
                }
            });
         });

        router.delete('/rooms/:rid', function(req, res) {
            roommodel.findById(req.params.rid, function(err, room) {
                if (err){
                    console.error('ERROR -'.red , 'DELETE api/rooms/:rid - findById room'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    var beds = room.beds;

                    // Remove all beds linked to the room
                    for (var k=0;k<beds.length;k++){
                        bedmodel.remove({
                            _id: beds[k]
                        }, function(err, doc) {
                            if (err){
                                console.error('ERROR -'.red , 'DELETE api/rooms/:rid - remove bed'.yellow, err.message);
                                // res.send({'error':true, 'message':err});
                            }
                        });
                    }

                    // Remove the room
                    roommodel.remove({
                        _id: req.params.rid
                    }, function(err, doc) {
                        if (err){
                            console.error('ERROR -'.red , 'DELETE api/rooms/:rid - remove room'.yellow, err.message);
                            res.send({'error':true, 'message':err});
                        }
                        else{
                            res.send({'error': false});
                        }
                    });
                }
            })


         });

        router.delete('/rooms/:rid/beds/:bid', function(req, res) {
            roommodel.findById(req.params.rid, function(err, room) {
                if (err){
                    console.error('ERROR -'.red , 'DELETE api/rooms/:rid/beds/:bid - findById room'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    room.beds.splice(room.beds.indexOf(req.params.bid),1);

                    room.save(function(err) {
                        if (err){
                            console.error('ERROR -'.red , 'DELETE api/rooms/:rid/beds/:bid - save room'.yellow, err.message);
                            // res.send({'error':true, 'message':err});
                        }
                    });
                }
            })

            bedmodel.remove({
                _id: req.params.bid
            }, function(err, doc) {
                if (err){
                    console.error('ERROR -'.red , 'DELETE api/rooms/:rid/beds/:bid - remove bed'.yellow, err.message);
                    res.send({'error':true, 'message':err});
                }
                else{
                    res.send({'error':false});
                }
            });
         });

};
