var models = require('../models');
var User = models.User;

exports.getUsersByQuery = function(query, opt, callback) {
  User.find(query, '', opt, callback);
};

exports.newAndSave = function(obj, callback) {
  var user = new User(obj);

  user.save(callback);
};

exports.getUsersByEmail = function(email, callback) {
  User.findOne({
    email: email
  }, callback);
};

exports.getUsersByUsername = function(username, callback) {
  User.findOne({
    username: username
  }, callback);
};

exports.getUsers = function(callback) {
  User.find(callback);
}

exports.updateUser = function(id, opt, callback) {
  User.update({
    _id: id
  }, opt, callback);
}
