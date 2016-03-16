/**
 * 管理员
 */

var User = require('../proxy/user');
var Offer = require('../proxy/offer');
var Audit = require('../proxy/audit');
var _ = require('lodash');

//config
var nations = require('../config/nation');
var categories = require('../config/category');
var types = require('../config/type');
var networks = require('../config/network');

exports.dashboard = function(req, res) {
  res.render('admin/dashboard', {
    user: req.session.user,
    tab: 'Dashboard'
  });
};

exports.users = function(req, res, next) {
  User.getUsers(function(err, users) {
    if (err) return next(err);

    res.render('admin/users', {
      user: req.session.user,
      users: users,
      tab: 'Users'
    });
  })
};

exports.updateUser = function(req, res, next) {
  var opt = req.body;
  var id = opt.id;
  delete opt.id;

  User.updateUser(id, opt, function(err) {
    if (err) next();
    else {
      res.json({
        status: 'ok'
      })
    }
  })
};

exports.getOffers = function(req, res, next) {
  var query = {
    offerType: req.params.offerType,
  };
  Offer.getOffersByQuery(query, function(err, offers) {
    res.render('admin/offers', {
      user: req.session.user,
      offers: offers || [],
      tab: _.capitalize(req.params.type) + ' ' + 'Offers',
      nations: nations,
      categories: categories,
      types: types,
      networks: networks,
    });
  })
};

exports.deleteOffer = function(req, res, next) {
  var id = req.body.id;
  Offer.deleteOffer(id, function(err) {
    if (err) {
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

exports.addOffer = function(req, res, next) {
  var obj = req.body;
  var user = req.session.user.username;
  delete obj.file;
  delete obj._id;
  obj.adduser = obj.updateuser = user;
  Offer.newAndSave(obj, function(err, offer) {
    console.error(err);
    if (err) {
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

exports.updateOffer = function(req, res, next) {
  var opt = req.body;
  var id = opt._id;
  var user = req.session.user.username;
  delete opt._id;
  delete opt.file;
  opt.updateuser = user;
  

  Offer.updateOffer(id, opt, function(err) {
    console.error(err);
    if (err) {
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

//用户审核offer使用
exports.getOffersByAdmin = function(req, res, next) {
  var status = req.params.status || 'wait';
  var query = {
    status: status
  };

  Audit.getAuditsByAdmin(query, function(err, offers) {
    if (err) console.error(err);
    console.log(offers);

    res.render('admin/auditOffers.html', {
      user: req.session.user,
      offers: offers,
      tab: 'Audit Offers',
      nations: nations,
      categories: categories,
      types: types,
      networks: networks,
      status: status,
    })
  })
}

exports.auditOffer = function(req, res, next) {
  var obj = req.body;
  var id = obj._id;
  delete obj._id;

  Audit.updateAudit(id, obj, function(err) {
    if (err) console.log(err);
    res.json({
      code: 200,
      error: JSON.stringify(err) || ''
    })
  })
}
