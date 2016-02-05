'use strict';

var express         = require('express'),
    kraken          = require('kraken-js'),
    cookieParser    = require('cookie-parser'),
    csrf            = require('csurf'),
    session = require('cookie-session'),
    bodyParser      = require('body-parser');

var app;

app = module.exports = express();

// app.use(cookieParser());

var options = require('./lib/spec')(app);
var userLib = require('./lib/user')();

//Method 1
// app.use(csrf({ cookie: true }));

// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

// method 2
// app.use(session({
//     secret: 'keyboard cat'
// }));
// app.use(cookieParser('secret'));
// app.use(csrf({ cookie: true }));
// app.use(function (req, res, next) {
//     res.cookie("XSRF-TOKEN", req.csrfToken());
//     return next();
// });

app.use(kraken(options));
