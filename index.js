'use strict';

var express         = require('express'),
    kraken          = require('kraken-js'),
    cookieParser    = require('cookie-parser'),
    csrf            = require('csurf'),
    session         = require('cookie-session'),
    bodyParser      = require('body-parser');

var app;

app = module.exports = express();

var options = require('./lib/spec')(app);
var userLib = require('./lib/user')();

app.use(kraken(options));
