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
    obj.companyname = faker.company.companyName();
    obj.email = faker.internet.email();
    obj.username = faker.name.findName();
    obj.website = faker.internet.url();
    obj.impressions = faker.random.number();
    obj.phone = faker.phone.phoneNumber();
    obj.contact = 'qq: ' + faker.random.number();
    obj.role = 'publisher';
    obj.password = faker.internet.password();
    obj.status = _.sample(['pass', 'wait', 'fail']);

    User.newAndSave(obj, function(err) {
      if (err) console.log(err);
      cb(err);
    })
  },
  function(err) {
    console.log('DONE');
  }
)
