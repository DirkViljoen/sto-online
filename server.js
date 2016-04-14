'use strict';

var app = require('./index');
var http = require('http');

var server = http.createServer(app);

var io = require('socket.io')(server);

/*
 * Create and start HTTP server.
 */

io.on('connection', function(socket){
    io.emit('user', 'New user connected.');
    console.log('New user connected');

    socket.on('change', function(msg){
        console.log('EMIT: change -', msg);
        io.emit('update', msg);
    });
});

server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
