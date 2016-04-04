var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var _ = require('lodash');

var escapeProperty = function(value) {
  return _.escape(value);
}

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    get: escapeProperty
  },
  //三种角色:normal\admin\root.root的权限最高
  role: {
    type: String,
    default: 'normal'
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  //状态: wait, pass
  status: {
    type: String,
    default: 'wait'
  }

});

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.hashPassword(password);
}).get(function() {
  return this._password;
});

UserSchema.methods = {
  isAdmin: function() {
    return this.role === 'admin' && this.status === 'pass';
  },
  isAuthenticated: function() {
    return this.role === 'normal' && this.status === 'pass';
  },
  validPassword: function(plainText) {
    return this.hashPassword(plainText) === this.hashedPassword;
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },
  hashPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },
  toJSON: function() {
    var obj = this.toObject();
    delete obj.hashed_password;
    delete obj.salt;
    return obj;
  },
};

mongoose.model('User', UserSchema);
