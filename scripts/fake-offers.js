var faker = require('faker');
var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');
var Offer = require('../proxy/offer');

var nations = require('../config/nation');
var categories = require('../config/category');
var networks = require('../config/network');
var types = require('../config/type');

var count = 0;
mongoose.connect('mongodb://localhost/wangnan');

async.whilst(
  function() {
    return count < 50;
  },
  function(cb) {
    count++;
    var obj = {};
    obj.link = faker.internet.url();
    obj.title = faker.name.title();
    obj.desc = faker.lorem.sentence();
    obj.nation = _.sample(nations);
    obj.category = _.sample(categories);
    obj.network = _.sample(networks);
    obj.type = _.sample(types);
    obj.logo = faker.image.imageUrl();
    obj.isEffect = true;
    obj.offerType = _.sample(['desktop', 'mobile']);
    obj.adduser = obj.updateuser = 'wang';
    obj.addtime = obj.updatetime = new Date();
    Offer.newAndSave(obj, function(err, offer) {
      cb(err);
    })
  },
  function(err) {
    console.log(err);
  }
)
