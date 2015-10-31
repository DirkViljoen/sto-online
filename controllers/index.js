'use strict';

var IndexModel = require('../models/index'),
    auth = require('../lib/auth');


module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {

        // res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        var obj = {};
        obj.p = req.params;
        obj.q = req.query;
        obj.u = req.user;

        res.render('app/start',obj);

    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

};
