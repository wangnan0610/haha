var User = require('../proxy/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wangnan');

var obj = {};

obj.companyname = 'elex';
obj.email = 'wangnan@elex-tech.com';
obj.username = 'wangnan';
obj.website= 'www.v9.com';
obj.impressions = '1000w';
obj.phone = '13412341234';
obj.contact = 'qq: kkkkk';
obj.role = 'admin';
obj.password = '123456';
obj.status = 'pass';

User.newAndSave(obj, function(err) {
  if (err) console.log(err);
  console.log('DONE');
})
