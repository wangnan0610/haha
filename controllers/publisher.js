/**
 * 注册人员
 */

var Offer = require('../proxy/offer');
var Audit = require('../proxy/audit');
var _ = require('lodash');

//config
var nations = require('../config/nation');
var categories = require('../config/category');
var types = require('../config/type');
var networks = require('../config/network');

exports.dashboard = function(req, res) {
  res.render('publisher/dashboard', {
    user: req.session.user,
    tab: 'Dashboard'
  })
}

exports.getOffers = function(req, res, next) {
  var query = {
    offerType: req.params.offerType,
  };
  Offer.getOffersByQuery(query, function(err, offers) {
    res.render('publisher/offers', {
      user: req.session.user,
      offers: offers || [],
      tab: _.capitalize(req.params.offerType) + ' ' + 'Offers',
      nations: nations,
      categories: categories,
      types: types,
      networks: networks,
    });
  })
};

exports.applyOffer = function(req, res, next) {
  var obj = {};
  obj.offer = req.body.offerId;
  obj.user = req.session.user._id;
  console.log(obj);

  Audit.addAudit(obj, function(err) {
    if (err) {
      console.error(err);
      res.json({
        code: 500,
        error: JSON.stringify(err)
      })
    } else {
      res.json({
        code: 200
      })
    }
  })
};

exports.getMyOffers = function(req, res, next) {
  var userId = req.session.user._id;
  var query = {
    user: userId
  }

  Audit.getAuditsByPublisher(query, function(err, offers) {
    if (err) console.error(err);
    console.log(offers);
    res.render('publisher/myOffers.html', {
      user: req.session.user,
      offers: offers,
      tab: 'My Offers',
      nations: nations,
      categories: categories,
      types: types,
      networks: networks,
    })
  })
}

exports.showOffer = function(req, res, next) {
  var offerId = req.params.offer;

  Offer.getOfferById(offerId, function(err, offer) {
    res.render('publisher/offer.html', {
      user: req.session.user,
      offer: offer,
      tab: 'Offer',
    })
  })
}
