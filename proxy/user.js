var models = require('../models');
// var User = models.User;
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const config = require('../config/environment');

const db = low(config.root + 'users.json', {
  storage: fileAsync
});

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
  return db.get('users').find({username: username}).value();
};

exports.getUsers = function(callback) {
  User.find(callback);
}

exports.updateUser = function(id, opt, callback) {
  User.update({
    _id: id
  }, opt, callback);
}
