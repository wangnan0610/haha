var User = require('../proxy/user');
var mongoose = require('mongoose');
var _ = require('lodash');

mongoose.connect('mongodb://localhost/wangnan');

var obj = {};
obj.username = 'root';
obj.role = 'root';
obj.password='123456';
obj.status = 'pass';

User.newAndSave(obj, function(err) {
  if (err) console.log(err);
  console.log('DONE');
});
