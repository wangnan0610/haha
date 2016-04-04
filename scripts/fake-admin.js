var User = require('../proxy/user');
var mongoose = require('mongoose');
var async = require('async');
var faker = require('faker');
var _ = require('lodash');

mongoose.connect('mongodb://localhost/wangnan');

var count = 0;

async.whilst(
  function() {
    return count < 10;
  },
  function(cb) {
    count++;
    var obj = {};
    obj.username = faker.name.findName();
    obj.role = 'admin';
    obj.password = faker.internet.password();
    obj.status = _.sample(['pass', 'wait', 'delete']);

    User.newAndSave(obj, function(err) {
      if (err) console.log(err);
      cb(err);
    })
  },
  function(err) {
    console.log('DONE');
  }
)
