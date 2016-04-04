//用户管理
var _ = require('lodash');

var User = require('../models').User;

//用户列表，root账户不出现
exports.index = function(req, res) {
  User.find({
    'role': {
      '$ne': 'root'
    }
  }, function(err, results) {
    if (err) {
      console.error(err.stack);
      res.render('error');
    } else {
      res.render('user', {
        users: results
      })
    }
  });
}

exports.update = function(req, res) {
  
}

exports.add = function(req, res) {

}

exports.del = function(req, res) {

}


