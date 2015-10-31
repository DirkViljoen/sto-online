'use strict';

var express         = require('express'),
    kraken          = require('kraken-js');

var app;

app = module.exports = express();

var options = require('./lib/spec')(app);
var userLib = require('./lib/user')();

app.use(kraken(options));
