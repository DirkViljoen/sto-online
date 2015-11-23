'use strict';

var db          = require('../lib/db-mongo');
var mongoose    = require('mongoose');
var moment      = require('moment');

// var bearmodel = require('../models/bear');
var doctermodel = require('../models/docter');
var therapistmodel = require('../models/therapist');
var roommodel = require('../models/rooms');

module.exports = function (router) {

    router.get('/', function (req, res) {
        console.log("Cookies: ", req.cookies);
        res.send('<code><pre>' + JSON.stringify({location: "/api/"}, null, 2) + '</pre></code>');
    });

    // Docters

        router.get('/docters', function(req, res) {
            doctermodel.find(function(err, docters) {
                if (err)
                    res.send(err);

                res.send(docters);
            });
         });

        router.get('/docters/:id', function(req, res) {
            doctermodel.findById(req.params.id, function(err, dokter) {
                if (err)
                    res.send(err);
                res.send(dokter);
            });
         });

        router.post('/docters', function(req, res) {
            var doc = new doctermodel();
            doc.name = req.body.name;
            doc.colour = req.body.colour;

            // save the docter and check for errors
            doc.save(function(err) {
                if (err){
                    res.send(err);
                }
                else
                {
                    res.json({ message: 'Docter created!' });
                }
            });
         });

        router.put('/docters/:id', function(req, res) {
            doctermodel.findById(req.params.id, function(err, doc) {
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

                        res.json({ message: 'Docter updated!' });
                    });
                }
            });
         });

        router.delete('/docters/:id', function(req, res) {
            doctermodel.remove({
                _id: req.params.id
            }, function(err, doc) {
                if (err)
                    res.send(err);

                res.json({ message: 'Docter successfully deleted' });
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

    // Rooms

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

        router.post('/rooms', function(req, res) {
            var room = new roommodel();
            room.name = req.body.name;
            room.group = req.body.group;
            room.docter = req.body.did;
            room.docterTimeIn = moment(0);
            room.therapist = req.body.tid;
            room.therapistTimeIn = moment(0);
            room.sisterTimeIn = moment(0);

            // save the therapist and check for errors
            room.save(function(err) {
                if (err){
                    res.send(err);
                }
                else{
                    res.json({ message: 'Room created!' });
                }
            });
         });

        router.put('/rooms/:id', function(req, res) {
            console.log(req.body);
            roommodel.findById(req.params.id, function(err, room) {
                console.log(room);
                if (err)
                    res.send(err);

                room.name = req.body.name;
                room.group = req.body.group;
                room.docter = req.body.docter;
                room.docterTimeIn = req.body.dtime;
                room.docterStart = req.body.docterStart;
                room.docterDone = req.body.docterDone;
                room.therapist = req.body.therapist;
                room.therapistTimeIn = req.body.ttime;
                room.therapistStart = req.body.therapistStart;
                room.therapistDone = req.body.therapistDone;
                room.sisterTimeIn = req.body.stime
                room.sisterStart = req.body.sisterStart;
                room.sisterDone = req.body.sisterDone;
                room.patient = req.body.patient;

                room.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Room updated!' });
                });

            });
         });

        router.patch('/rooms/:id/:action', function(req, res) {
            roommodel.findById(req.params.id, function(err, room) {

                if (err)
                    res.send(err);

                var msg = '';

                console.log(req.body);

                switch(req.params.action) {
                    case 'dstart':
                        room.docterTimeIn = moment();
                        room.docterDuration = req.body.docterDuration ? req.body.docterDuration : 20;
                        room.docterStart = true;
                        room.docterDone = false;
                        msg = 'docter started.';
                        break;
                    case 'dstop':
                        room.docterDone = true;
                        msg = 'docter stopped';
                        break;
                    case 'dreset':
                        room.docterStart = false;
                        room.docterDone = false;
                        msg = 'docter reset';
                        break;
                    case 'tstart':
                        room.therapistTimeIn = moment();
                        room.therapistDuration = req.body.therapistDuration ? req.body.therapistDuration : 20;
                        room.therapistStart = true;
                        room.therapistDone = false;
                        msg = 'therapist started';
                        break;
                    case 'tstop':
                        room.therapistDone = true;
                        msg = 'therapist stopped';
                        break;
                    case 'treset':
                        room.therapistStart = false;
                        room.therapistDone = false;
                        msg = 'therapist reset';
                        break;
                    case 'sstart':
                        room.sisterTimeIn = moment();
                        room.sisterDuration = req.body.sisterDuration ? req.body.sisterDuration : 5;
                        room.sisterStart = true;
                        room.sisterDone = false;
                        msg = 'sister started';
                        break;
                    case 'sstop':
                        room.sisterDone = true;
                        msg = 'sister stopped';
                        break;
                    case 'sreset':
                        room.sisterStart = false;
                        room.sisterDone = false;
                        msg = 'sister reset';
                        break;
                    case 'resetAll':
                        room.docterStart = false;
                        room.docterDone = false;
                        room.therapistStart = false;
                        room.therapistDone = false;
                        room.sisterStart = false;
                        room.sisterDone = false;
                        msg = 'All reset';
                        break;
                    default:
                        msg = 'unknown action';
                }



                room.save(function(err) {
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

                res.json({ message: 'Room successfully deleted' });
            });
         });

};
