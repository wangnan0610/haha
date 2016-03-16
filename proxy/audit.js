var models = require('../models');
var Audit = models.Audit;
var Offer = models.Offer;
var User = models.User;
var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var colors = require('colors');

exports.addAudit = function(obj, callback) {
  var audit = new Audit(obj);

  audit.save(callback);
}

exports.updateAudit = function(id, opt, callback) {
  Audit.update({
    _id: mongoose.Types.ObjectId(id)
  }, opt, callback);
}

//需要查询offer
//TODO: mongoose doc 和object 的区别
exports.getAuditsByPublisher = function(query, callback) {
  var arr = [];
  query.user = mongoose.Types.ObjectId(query.user);

  Audit.find(query, function(err, audits) {
    if (err) callback(err);
    else {
      async.eachSeries(audits, function(au, fn) {
        Offer.findOne({
          _id: mongoose.Types.ObjectId(au.offer)
        }, function(err, offer) {
          if (err) fn(err);
          else {
            au = au.toObject();
            au.offerObject = offer;
            arr.push(au);
            fn(null);
          }
        })
      }, function(err) {
        callback(err, arr);
      })
    }
  });
}

//需要查询offer表以及user表
exports.getAuditsByAdmin = function(query, callback) {
  var arr = [];

  Audit.find(query, function(err, audits) {
    if (err) callback(err);
    else {
      async.eachSeries(audits, function(au, fn) {
        au = au.toObject();
        async.waterfall([

          //查询user
          function(cb) {
            User.findOne({
              _id: mongoose.Types.ObjectId(au.user)
            }, function(err, user) {
              au.userObject = user;
              cb(err);
            })            
          },
          //查询offer
          function(cb) {
            Offer.findOne({
              _id: mongoose.Types.ObjectId(au.offer)
            }, function(err, offer) {
              au.offerObject = offer;
              cb(err);
            })            

          }
        ], function(err) {
          arr.push(au);
          fn(err);
        })
      }, function(err) {
        callback(err, arr);
      })
    }
  })
}
