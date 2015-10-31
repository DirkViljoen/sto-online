'use strict';

var RoomsModel = require('../models/rooms');


module.exports = function (router) {

    var model = new RoomsModel();

    router.get('/', function (req, res) {

        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('rooms/manage',obj);

    });

    router.get('/view', function (req, res) {

        // res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('rooms/view',obj);

    });

};
