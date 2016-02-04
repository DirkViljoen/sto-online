'use strict';

var express         = require('express'),
    kraken          = require('kraken-js'),
    cookieParser    = require('cookie-parser'),
    csrf            = require('csurf'),
    bodyParser      = require('body-parser');

var app;

app = module.exports = express();

// app.use(cookieParser());

var options = require('./lib/spec')(app);
var userLib = require('./lib/user')();

// app.use(csrf({ cookie: true }));

// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

app.use(kraken(options));
