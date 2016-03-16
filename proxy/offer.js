var models = require('../models');
var Offer = models.Offer;
var _ = require('lodash');
var mongoose = require('mongoose');

exports.getOffersByQuery = function(query, projection, opt, callback) {
  query = _.merge(query, {
    isEffect: true
  });
  projection = projection || null;
  opt = opt || {};
  console.log(query);

  Offer.find(query, projection, opt, callback);
};

exports.newAndSave = function(obj, callback) {
  var offer = new Offer(obj);

  offer.save(callback);
};

exports.updateOffer = function(id, opt, callback) {
  Offer.update({
    _id: mongoose.Types.ObjectId(id)
  }, opt, callback);
}

exports.deleteOffer = function(id, callback) {
  Offer.update({
    _id: mongoose.Types.ObjectId(id)
  }, {
    isEffect: false
  }, callback);
}

exports.getOfferById = function(id, callback) {
  Offer.findOne({
    _id: mongoose.Types.ObjectId(id)
  }, callback);
}
