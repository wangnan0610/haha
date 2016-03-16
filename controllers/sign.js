var passport = require('passport');
var User = require('../proxy').User;
var validator = require('validator');
var eventproxy = require('eventproxy');
var _ = require('lodash');

//默认打开页
exports.index = function(req, res) {
  res.render('sign/login', {
    error: null
  });
}

//注册页
exports.showRegister = function(req, res) {
  res.render('sign/register', {
    error: null
  });
};

//注册
module.exports.register = function(req, res, next) {
  var user = {};
  user.username = validator.trim(req.body.username).toLowerCase();
  user.password = validator.trim(req.body.password);
  //没有rePassword
  user.rePassword = validator.trim(req.body.repassword);

  var ep = new eventproxy();
  ep.fail(next);

  ep.on('prop_err', function(msg) {
    res.status(422);
    res.render('sign/register', {
      error: msg
    });
  })

  //验证信息正确性
  if (Object.keys(user).some(function(item) {
    return !user[item];
  })) {
    return ep.emit('prop_err', '信息不完整。');
  };
  if (user.password !== user.rePassword) {
    return ep.emit('prop_err', '两次密码输入不一样');
  }

  delete user.rePassword;

  User.getUsersByQuery({
    'username': user.username
  }, {}, function(err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      return ep.emit('prop_err', '用户名已被使用。');
    }

    User.newAndSave(user, function(err) {
      if (err) return next(err);
      res.render('notify/notify', {
        error: '等待验证'
      });
    })
  })

};

//登录页 
exports.showLogin = function(req, res) {
  res.render('sign/login', {
    error: null
  });
};

//登录
exports.login = function(req, res, next) {
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var password = validator.trim(req.body.password);
  var ep = new eventproxy();

  ep.fail(next);

  if (!loginname || !password) {
    res.status(422);
    return res.render('sign/login', {
      error: '信息不完整.'
    });
  }

  var getUser = User.getUsersByUsername;

  ep.on('login_error', function(login_error) {
    res.status(403);
    res.render('sign/login', {
      error: '用户名密码错误'
    });
  });

  getUser(loginname, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return ep.emit('login_error');
    }
    if (user.status !== 'pass') {
      return res.render('notify/notify', {
        error: '还未通过申请'
      });
    }

    req.session.user = user;

    res.redirect('/dashboard');
  })
};

//登出
exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/');
};
