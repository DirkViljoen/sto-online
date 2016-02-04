'use strict';

module.exports = function (router) {

    router.get('/doctors', function (req, res) {

        // res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('settings/doctors',obj);

    });

    router.get('/therapists', function (req, res) {

        // res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('settings/therapists',obj);

    });

    router.get('/rooms', function (req, res) {

        // res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('rooms/manage2',obj);

    });

};
