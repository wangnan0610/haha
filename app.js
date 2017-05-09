process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
var config = require('./config/environment');

var app = express();

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
